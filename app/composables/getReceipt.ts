import type { ReceiptSchema } from "~~/types/receipts";

export const useGetReceipt = (id: string) => {
  const client = useSupabaseClient();

  const {
    data: receiptData,
    status,
    pending,
  } = useAsyncData(`receipt_${id}`, async () => {
    const [receiptResult, itemsResult] = await Promise.all([
      client.from("receipts").select("*").eq("id", id).single(),
      client.from("receipt_items").select("*").eq("receipt_id", id),
    ]);

    return {
      receipt: (receiptResult.data ?? null) as ReceiptSchema | null,
      items: itemsResult.data ?? [],
    };
  });

  const receipt = computed(() => receiptData.value?.receipt);
  const receiptItems = computed(() => receiptData.value?.items ?? []);

  return {
    receipt,
    receiptItems,
    status,
    loading: pending,
  };
};
