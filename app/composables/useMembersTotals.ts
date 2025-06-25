import type { Database } from '~~/types/database.types';
import { tables } from '~~/utils/tables'

export function useMembersTotals(receiptId: string) {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useToast();

  const { data: receiptItems, status: receiptItemsStatus, error: receiptItemsError } =  useAsyncData(
    'receipt items totals',
    async () => {
      if (!user.value) {
        throw new Error('No user authenticated');
      }

    const { data, error } = await client
      .from(tables.receiptItems)
      .select("id, title")
      .eq("receipt_id", receiptId);

    if (error) {
      toast.add({
        title: "Error fetching receipt item assignments",
        description: error.message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    }

    if (!data) {
      return [];
    }

    const formattedData = data.reduce((acc, item) => {
      acc[item.id] = item.title;
      return acc;
    }, {} as Record<string, string>);

    return formattedData;
  });

  return {

    // Receipt items totals
    receiptItems,
    receiptItemsStatus,
    receiptItemsError,
  };
}