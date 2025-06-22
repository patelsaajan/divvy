import { supabase } from "~~/utils/supabase";

export const useGetReceipt = (id: string) => {
  const {
    data: receiptData,
    status,
    pending,
  } = useAsyncData(`receipt_${id}`, async () => {
    const [receiptResult, itemsResult] = await Promise.all([
      supabase.from("receipts").select("*").eq("id", id).single(),
      supabase.from("receipt_items").select("*").eq("receipt_id", id),
    ]);

    return {
      receipt: receiptResult.data ?? null,
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
