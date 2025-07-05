import type { Database } from '~~/types/database.types';

// Define the expected return type for the RPC function based on SQL types
type ReceiptItemAssignmentDetail = {
  title: string;
  cost: number;
  user_name: string;
  method: string;
  value: number;
  calculated_amount: number;
};

type UserItemAssignments = {
  user_name: string;
  assignments: ReceiptItemAssignmentDetail[];
};

type MembersTotalsResult = UserItemAssignments[];

export function useMembersTotals(receiptId: string) {
  const client = useSupabaseClient<Database>();
  const toast = useToast();

  const { data: membersTotals, error: membersTotalsError } = useAsyncData(
    `members-totals-${receiptId}`,
    async (): Promise<MembersTotalsResult | null> => {
      try {
        const { data, error } = await client.rpc('get_members_totals', {
          receipt_id_input: receiptId
        });

        if (error) {
          console.error('RPC error:', error);
          throw error;
        }

        return data as MembersTotalsResult;
      } catch (err) {
        console.error('Composable error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch members totals';
        toast.add({
          title: "Error fetching members totals",
          description: errorMessage,
          color: "error",
          icon: "i-heroicons-x-circle",
        });
        throw err;
      }
    },
    {
      server: false,
      default: () => null,
    }
  );
  
  // Computed properties for better UX
  const hasError = computed(() => !!membersTotalsError.value);
  const hasData = computed(() => !!membersTotals.value && membersTotals.value.length > 0);

  return {
    // Members totals data
    membersTotals,
    membersTotalsError,
    
    // Computed properties
    hasError,
    hasData,
  };
}