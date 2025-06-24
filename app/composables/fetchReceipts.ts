export const useReceipts = () => {
  const receipts = useState<any[]>("receipts", () => []);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const client = useSupabaseClient();

  async function refresh() {
    loading.value = true;
    error.value = null;

    const { data, error: sbError } = await client.from("receipts").select("*");

    if (sbError) {
      error.value = sbError.message;
    } else if (data) {
      receipts.value = data;
    }

    loading.value = false;
  }

  watch(
    receipts,
    (newReceipts) => {
      if (newReceipts.length === 0 && !loading.value) {
        refresh();
      }
    },
    { immediate: true }
  );

  return { receipts, loading, error, refresh };
};
