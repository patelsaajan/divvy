import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Database } from "~~/types/database.types";

// Type aliases for better readability
type ReceiptItem = Database["public"]["Tables"]["receipt_items"]["Row"];
type ReceiptItemInsert =
  Database["public"]["Tables"]["receipt_items"]["Insert"];
type ReceiptItemUpdate =
  Database["public"]["Tables"]["receipt_items"]["Update"];

export const useReceiptItems = (receiptId: string) => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query for receipt items
  const receiptItemsQuery = useQuery({
    queryKey: ["receipt-items", receiptId],
    queryFn: async (): Promise<ReceiptItem[]> => {
      if (!user.value) throw new Error("No user");

      const { data, error } = await client
        .from("receipt_items")
        .select(
          `
          *,
          receipt_item_assignments(*)
        `
        )
        .eq("receipt_id", receiptId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user.value && !!receiptId,
  });

  // Mutation for creating receipt item
  const createReceiptItemMutation = useMutation({
    mutationFn: async (itemData: ReceiptItemInsert): Promise<ReceiptItem> => {
      const { data, error } = await client
        .from("receipt_items")
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipt-items", receiptId] });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Creating Item",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  // Mutation for updating receipt item
  const updateReceiptItemMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: ReceiptItemUpdate;
    }): Promise<void> => {
      const { error } = await client
        .from("receipt_items")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipt-items", receiptId] });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Updating Item",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  // Mutation for deleting receipt item
  const deleteReceiptItemMutation = useMutation({
    mutationFn: async (itemId: string): Promise<void> => {
      const { error } = await client
        .from("receipt_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receipt-items", receiptId] });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Error Deleting Item",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    },
  });

  // Helper functions
  const createReceiptItem = (title: string, cost: number) => {
    if (!user.value) return;

    return createReceiptItemMutation.mutate({
      title,
      cost,
      receipt_id: receiptId,
    });
  };

  const updateReceiptItem = (id: string, updates: ReceiptItemUpdate) => {
    return updateReceiptItemMutation.mutate({ id, updates });
  };

  const deleteReceiptItem = (itemId: string) => {
    return deleteReceiptItemMutation.mutate(itemId);
  };

  const refetch = () => {
    receiptItemsQuery.refetch();
  };

  return {
    // Receipt items data
    receiptItems: receiptItemsQuery.data,
    receiptItemsLoading: receiptItemsQuery.isLoading,
    receiptItemsError: receiptItemsQuery.error,
    receiptItemsRefresh: refetch,

    // Create
    createReceiptItem,
    createReceiptItemLoading: createReceiptItemMutation.isPending,
    createReceiptItemError: createReceiptItemMutation.error,

    // Update
    updateReceiptItem,
    updateReceiptItemLoading: updateReceiptItemMutation.isPending,
    updateReceiptItemError: updateReceiptItemMutation.error,

    // Delete
    deleteReceiptItem,
    deleteReceiptItemLoading: deleteReceiptItemMutation.isPending,
    deleteReceiptItemError: deleteReceiptItemMutation.error,
  };
};
