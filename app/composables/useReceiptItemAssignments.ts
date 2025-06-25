import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { v4 as uuid } from "uuid";
import { toRef } from "vue";
import type { Database } from "~~/types/database.types";
import type { ReceiptItemAssignmentForm } from "~~/types/receipts";
import { tables } from "~~/utils/tables";

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

// Singleton pattern to ensure only one instance per receipt
let assignmentsState: ReturnType<typeof createAssignmentsState> | null = null;
let currentReceiptId: string | null = null;

function createAssignmentsState(receiptId: string) {
  const client = useSupabaseClient<Database>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const assignmentsQuery = useQuery({
    queryKey: ["receipt-item-assignments", receiptId],
    queryFn: async (): Promise<Record<string, ReceiptItemAssignmentForm[]>> => {
      const { data: receiptItems, error: itemsError } = await client
        .from(tables.receiptItems)
        .select("id")
        .eq("receipt_id", receiptId);

      if (itemsError) throw itemsError;
      if (!receiptItems) return {};

      const itemIds = receiptItems.map((item) => item.id);

      const { data: assignments, error: assignmentsError } = await client
        .from(tables.receiptItemAssignments)
        .select("*")
        .in("receipt_item_id", itemIds);

      if (assignmentsError) throw assignmentsError;
      if (!assignments) return {};

      // Group assignments by receipt item ID
      const assignmentMap: Record<string, ReceiptItemAssignmentForm[]> = {};
      assignments.forEach((assignment) => {
        if (!assignmentMap[assignment.receipt_item_id]) {
          assignmentMap[assignment.receipt_item_id] = [];
        }
        assignmentMap[assignment.receipt_item_id]!.push(
          dbToFormAssignment(assignment)
        );
      });

      return assignmentMap;
    },
    enabled: !!receiptId,
  });

  const updateAssignmentsMutation = useMutation({
    mutationFn: async ({
      itemId,
      previousAssignments,
      newAssignments,
    }: {
      itemId: string;
      previousAssignments: ReceiptItemAssignmentForm[];
      newAssignments: ReceiptItemAssignmentForm[];
    }) => {
      // Find assignments to delete by comparing IDs
      const newAssignmentIds = new Set(
        newAssignments.filter((a) => a.id).map((a) => a.id)
      );

      const assignmentsToDelete = previousAssignments
        .filter((a) => a.id && !newAssignmentIds.has(a.id))
        .map((a) => a.id)
        .filter((id): id is string => id !== undefined);

      // 1. Delete assignments that are not in the new set
      if (assignmentsToDelete.length > 0) {
        const { error: deleteError } = await client
          .from(tables.receiptItemAssignments)
          .delete()
          .in("id", assignmentsToDelete)
          .eq("receipt_item_id", itemId);

        if (deleteError) throw deleteError;
      }

      // 2. Upsert all new assignments
      if (newAssignments.length > 0) {
        const toUpsert = newAssignments.map((assignment) => ({
          id: assignment.id || uuid(),
          receipt_item_id: itemId,
          user_name: assignment.user_name,
          method: assignment.method,
          value: assignment.value ?? 0,
          calculated_amount: assignment.value ?? 0,
        }));

        const { error: upsertError } = await client
          .from(tables.receiptItemAssignments)
          .upsert(toUpsert, { onConflict: "id" });

        if (upsertError) throw upsertError;
      }
    },
    onSuccess: () => {
      // Invalidate query to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["receipt-item-assignments", receiptId],
      });
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
    mutationFn: async ({
      itemId,
      assignmentId,
    }: {
      itemId: string;
      assignmentId: string;
    }) => {
      const { error } = await client
        .from(tables.receiptItemAssignments)
        .delete()
        .eq("id", assignmentId)
        .eq("receipt_item_id", itemId);

      if (error) throw error;

      queryClient.invalidateQueries({
        queryKey: ["receipt-item-assignments", receiptId],
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
  const updateAssignments = (
    itemId: string,
    newAssignments: ReceiptItemAssignmentForm[],
    previousAssignments: ReceiptItemAssignmentForm[]
  ) => {
    return updateAssignmentsMutation.mutate({
      itemId,
      previousAssignments,
      newAssignments,
    });
  };

  const deleteAssignment = (itemId: string, assignmentId: string) => {
    return deleteAssignmentMutation.mutate({ itemId, assignmentId });
  };

  // Create a reactive reference to the query data
  const assignmentsMap = toRef(assignmentsQuery, "data") as Ref<
    Record<string, ReceiptItemAssignmentForm[]>
  >;

  return {
    // Assignments data
    assignmentsMap,
    assignmentsLoading: assignmentsQuery.isLoading,
    assignmentsError: assignmentsQuery.error,
    assignmentsRefresh: () => assignmentsQuery.refetch(),

    // Update
    updateAssignments,
    updateAssignmentsLoading: updateAssignmentsMutation.isPending,
    updateAssignmentsError: updateAssignmentsMutation.error,

    // Delete
    deleteAssignment,
    deleteAssignmentLoading: deleteAssignmentMutation.isPending,
    deleteAssignmentError: deleteAssignmentMutation.error,
  };
}

export const useReceiptItemAssignments = (receiptId?: string) => {
  // If no receiptId is provided, return a default state
  if (!receiptId) {
    return {
      assignmentsMap: ref({}),
      assignmentsLoading: ref(false),
      assignmentsError: ref(null),
      assignmentsRefresh: () => Promise.resolve(),
      updateAssignments: () => {},
      updateAssignmentsLoading: ref(false),
      updateAssignmentsError: ref(null),
      deleteAssignment: () => {},
      deleteAssignmentLoading: ref(false),
      deleteAssignmentError: ref(null),
    };
  }

  // Clear state when switching receipts
  if (currentReceiptId !== receiptId) {
    assignmentsState = null;
    currentReceiptId = receiptId;
  }

  // Create new state if it doesn't exist
  if (!assignmentsState) {
    assignmentsState = createAssignmentsState(receiptId);
  }

  return assignmentsState;
};
