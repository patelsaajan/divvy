import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Database, Tables, TablesUpdate } from "~~/types/database.types";
import { tables } from "~~/utils/tables";

type ReceiptItem = Tables<"receipt_items">;
type ReceiptItemUpdate = TablesUpdate<"receipt_items">;

export const useReceiptItems = (receiptId?: string) => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useToast();
  const queryClient = useQueryClient();

  // If no receiptId is provided, return a default state
  if (!receiptId) {
    return {
      receiptItems: ref([]),
      receiptItemsLoading: ref(false),
      receiptItemsError: ref(null),
      receiptItemsRefresh: () => Promise.resolve(),
      createReceiptItem: () => {},
      createReceiptItemLoading: ref(false),
      createReceiptItemError: ref(null),
      updateReceiptItem: () => {},
      updateReceiptItemLoading: ref(false),
      updateReceiptItemError: ref(null),
      deleteReceiptItem: () => {},
      deleteReceiptItemLoading: ref(false),
      deleteReceiptItemError: ref(null),
    };
  }

  // Query for receipt items
  const receiptItemsQuery = useQuery({
    queryKey: [tables.receiptItems, receiptId],
    queryFn: async (): Promise<ReceiptItem[]> => {
      if (!user.value) throw new Error("No user");

      const { data, error } = await client
        .from(tables.receiptItems)
        .select("*")
        .eq("receipt_id", receiptId)
        .order("created_at", { ascending: true }) // primary ordering by created_at
        .order("title", { ascending: true }); // secondary ordering by title

      if (error) throw error;

      return data;
    },
    enabled: !!user.value && !!receiptId,
  });

  // Mutation for creating receipt item
  const createReceiptItemMutation = useMutation({
    mutationFn: async ({
      title,
      cost,
      receipt_id,
    }: {
      title: string;
      cost: number;
      receipt_id: string;
    }): Promise<ReceiptItem> => {
      const { data, error } = await client
        .from(tables.receiptItems)
        .insert({
          title,
          cost,
          receipt_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [tables.receiptItems, receiptId],
      });
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
        .from(tables.receiptItems)
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [tables.receiptItems, receiptId],
      });
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
        .from(tables.receiptItems)
        .delete()
        .eq("id", itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [tables.receiptItems, receiptId],
      });
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
