import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "~~/types/database.types";
import { tables } from "~~/utils/tables";

// Type aliases for better readability
type Receipt = Tables<"receipts">;
type ReceiptInsert = TablesInsert<"receipts">;
type ReceiptUpdate = TablesUpdate<"receipts">;

// Hook for fetching a single receipt
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
      // Also invalidate the receipts list
      queryClient.invalidateQueries({ queryKey: [tables.receipts, "list"] });
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
      // Also invalidate the receipts list
      queryClient.invalidateQueries({ queryKey: [tables.receipts, "list"] });
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
      // Also invalidate the receipts list
      queryClient.invalidateQueries({ queryKey: [tables.receipts, "list"] });
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

// Hook for fetching multiple receipts
export const useReceipts = () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query for receipts list
  const receiptsQuery = useQuery({
    queryKey: [tables.receipts, "list"],
    queryFn: async (): Promise<Receipt[]> => {
      if (!user.value) throw new Error("No user");

      const { data, error } = await client
        .from(tables.receipts)
        .select("*")
        .eq("user_id", user.value.id)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user.value,
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
      queryClient.invalidateQueries({ queryKey: [tables.receipts, "list"] });
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

  // Mutation for deleting receipt
  const deleteReceiptMutation = useMutation({
    mutationFn: async (receiptId: string): Promise<void> => {
      const { error } = await client
        .from(tables.receipts)
        .delete()
        .eq("id", receiptId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tables.receipts, "list"] });
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

  const deleteReceipt = (receiptId: string) => {
    return deleteReceiptMutation.mutate(receiptId);
  };

  const refetch = () => {
    receiptsQuery.refetch();
  };

  return {
    // Receipts data
    receipts: receiptsQuery.data,
    receiptsLoading: receiptsQuery.isLoading,
    receiptsError: receiptsQuery.error,
    receiptsRefresh: refetch,

    // Create
    createReceipt,
    createReceiptLoading: createReceiptMutation.isPending,
    createReceiptError: createReceiptMutation.error,

    // Delete
    deleteReceipt,
    deleteReceiptLoading: deleteReceiptMutation.isPending,
    deleteReceiptError: deleteReceiptMutation.error,
  };
};
