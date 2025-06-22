import { useState } from "#app";
import { useSupabaseClient } from "#imports"; // auto-imported by Nuxt Supabase

export const useReceipts = () => {
  const receipts = useState<any[]>("receipts", () => []);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const client = useSupabaseClient();

  async function fetchItems() {
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
        fetchItems();
      }
    },
    { immediate: true }
  );

  return { receipts, loading, error, fetchItems };
};
