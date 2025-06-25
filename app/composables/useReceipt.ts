import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Database } from "~~/types/database.types";
import { tables } from "~~/utils/tables";

// Type aliases for better readability
type Receipt = Database["public"]["Tables"]["receipts"]["Row"];
type ReceiptInsert = Database["public"]["Tables"]["receipts"]["Insert"];
type ReceiptUpdate = Database["public"]["Tables"]["receipts"]["Update"];

export const useReceipt = (id: string) => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query for receipt data
  const receiptQuery = useQuery({
    queryKey: [tables.receipts, id],
    queryFn: async (): Promise<Receipt> => {
      if (!user.value) throw new Error("No user");

      const { data, error } = await client
        .from(tables.receipts)
        .select("*")
        .eq("id", id)
        .eq("user_id", user.value.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user.value && !!id,
  });

  // Mutation for creating receipt
  const createReceiptMutation = useMutation({
    mutationFn: async (receiptData: ReceiptInsert): Promise<Receipt> => {
      const { data, error } = await client
        .from(tables.receipts)
        .insert(receiptData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tables.receipts, id] });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Creating Receipt",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  // Mutation for updating receipt
  const updateReceiptMutation = useMutation({
    mutationFn: async (updates: ReceiptUpdate): Promise<void> => {
      const { error } = await client
        .from(tables.receipts)
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tables.receipts, id] });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Updating Receipt",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  // Mutation for deleting receipt
  const deleteReceiptMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      const { error } = await client
        .from(tables.receipts)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tables.receipts, id] });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Deleting Receipt",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  // Helper functions
  const createReceipt = (receiptData: ReceiptInsert) => {
    return createReceiptMutation.mutate(receiptData);
  };

  const updateReceipt = (updates: ReceiptUpdate) => {
    return updateReceiptMutation.mutate(updates);
  };

  const deleteReceipt = () => {
    return deleteReceiptMutation.mutate();
  };

  const refetch = () => {
    receiptQuery.refetch();
  };

  return {
    // Receipt data
    receipt: receiptQuery.data,
    receiptLoading: receiptQuery.isLoading,
    receiptError: receiptQuery.error,
    receiptRefresh: refetch,

    // Create
    createReceipt,
    createReceiptLoading: createReceiptMutation.isPending,
    createReceiptError: createReceiptMutation.error,

    // Update
    updateReceipt,
    updateReceiptLoading: updateReceiptMutation.isPending,
    updateReceiptError: updateReceiptMutation.error,

    // Delete
    deleteReceipt,
    deleteReceiptLoading: deleteReceiptMutation.isPending,
    deleteReceiptError: deleteReceiptMutation.error,
  };
};
