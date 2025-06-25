import { tables } from "~~/utils/tables";

export const useReceipts = () => {
  const receipts = useState<any[]>("receipts", () => []);
  const loading = useState<boolean>("receipts-loading", () => false);
  const error = useState<string | null>("receipts-error", () => null);

  const fetchReceipts = async () => {
    const client = useSupabaseClient();
    loading.value = true;
    error.value = null;

    try {
      const { data, error: sbError } = await client
        .from(tables.receipts)
        .select("*");
      if (sbError) throw sbError;
      receipts.value = data;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch receipts";
    } finally {
      loading.value = false;
    }
  };

  // Watch for changes in receipts array
  watch(
    receipts,
    (newReceipts) => {
      if (newReceipts.length === 0 && !loading.value) {
        fetchReceipts();
      }
    },
    { immediate: true }
  );

  return { receipts, loading, error, refresh: fetchReceipts };
};
