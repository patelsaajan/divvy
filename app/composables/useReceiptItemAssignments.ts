import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { v4 as uuid } from "uuid";
import type { Database } from "~~/types/database.types";
import type { ReceiptItemAssignmentForm } from "~~/types/receipts";

// Database assignment type
export type DbAssignment =
  Database["public"]["Tables"]["receipt_item_assignments"]["Row"];

// Convert database assignment to form assignment
const dbToFormAssignment = (
  dbAssignment: DbAssignment
): ReceiptItemAssignmentForm => ({
  id: dbAssignment.id,
  user_name: dbAssignment.user_name,
  method: dbAssignment.method as "equal" | "percent" | "amount",
  value: dbAssignment.value,
});

export const useReceiptItemAssignments = (receiptItemId: string) => {
  const client = useSupabaseClient<Database>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const assignmentsQuery = useQuery({
    queryKey: ["receipt-item-assignments", receiptItemId],
    queryFn: async (): Promise<ReceiptItemAssignmentForm[]> => {
      const { data, error } = await client
        .from("receipt_item_assignments")
        .select("*")
        .eq("receipt_item_id", receiptItemId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []).map(dbToFormAssignment);
    },
    enabled: !!receiptItemId,
  });

  const updateAssignmentsMutation = useMutation({
    mutationFn: async (newAssignments: ReceiptItemAssignmentForm[]) => {
      console.log("Starting assignment update for item:", receiptItemId);
      console.log("New assignments to save:", newAssignments);

      // Use existing assignments from query data, filtered for current receipt item ID
      const existingAssignments = assignmentsQuery.data.value || [];
      console.log("Existing assignments from DB:", existingAssignments);

      const existingMap = new Map(existingAssignments.map((a) => [a.id, a]));
      const newMap = new Map(
        newAssignments.filter((a) => a.id).map((a) => [a.id!, a])
      );

      // 1. Deleted: In DB but not in new list
      const toDelete = Array.from(existingMap.keys()).filter(
        (id) => !newMap.has(id)
      );
      console.log("Assignments to delete:", toDelete);

      if (toDelete.length > 0) {
        const { error: deleteError } = await client
          .from("receipt_item_assignments")
          .delete()
          .in("id", toDelete);
        if (deleteError) {
          console.error("Delete error:", deleteError);
          throw deleteError;
        }
        console.log("Successfully deleted assignments");
      }

      // 2. Upsert: New or updated assignments
      const toUpsert = newAssignments.map((assignment) => {
        const assignmentId = assignment.id || uuid();
        return {
          id: assignmentId,
          receipt_item_id: receiptItemId,
          user_name: assignment.user_name,
          method: assignment.method,
          value: assignment.value ?? 0,
          calculated_amount: assignment.value ?? 0, // For now
        };
      });
      console.log("Assignments to upsert:", toUpsert);

      if (toUpsert.length > 0) {
        const { error: upsertError } = await client
          .from("receipt_item_assignments")
          .upsert(toUpsert, { onConflict: "id" });
        if (upsertError) {
          console.error("Upsert error:", upsertError);
          throw upsertError;
        }
        console.log("Successfully upserted assignments");
      }

      // Invalidate query
      queryClient.invalidateQueries({
        queryKey: ["receipt-item-assignments", receiptItemId],
      });
      console.log("Query invalidated successfully");
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Updating Assignments",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await client
        .from("receipt_item_assignments")
        .delete()
        .eq("id", assignmentId)
        .eq("receipt_item_id", receiptItemId);
      if (error) throw error;
      queryClient.invalidateQueries({
        queryKey: ["receipt-item-assignments", receiptItemId],
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Deleting Assignment",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  // Helper functions
  const updateAssignments = (newAssignments: ReceiptItemAssignmentForm[]) => {
    return updateAssignmentsMutation.mutate(newAssignments);
  };

  const deleteAssignment = (assignmentId: string) => {
    return deleteAssignmentMutation.mutate(assignmentId);
  };

  const refetch = () => {
    assignmentsQuery.refetch();
  };

  return {
    // Assignments data
    assignments: assignmentsQuery.data,
    assignmentsLoading: assignmentsQuery.isLoading,
    assignmentsError: assignmentsQuery.error,
    assignmentsRefresh: refetch,

    // Update
    updateAssignments,
    updateAssignmentsLoading: updateAssignmentsMutation.isPending,
    updateAssignmentsError: updateAssignmentsMutation.error,

    // Delete
    deleteAssignment,
    deleteAssignmentLoading: deleteAssignmentMutation.isPending,
    deleteAssignmentError: deleteAssignmentMutation.error,
  };
};
