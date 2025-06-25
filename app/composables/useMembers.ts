import type { Database } from "~~/types/database.types";
import type { ReceiptMember } from "~~/types/receipts";

// Singleton state
let membersState: ReturnType<typeof createMembersState> | null = null;

function createMembersState() {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const toast = useToast();

  // State
  const members = ref<ReceiptMember[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Convert database member to component member
  const dbToComponentMember = (
    dbMember: Database["public"]["Tables"]["members"]["Row"]
  ): ReceiptMember => ({
    id: dbMember.id,
    name: dbMember.name,
    checked: false, // This is UI state
  });

  // Fetch all members for the current user
  const fetchMembers = async () => {
    if (!user.value) return;

    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", user.value.id)
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      members.value = (data || []).map(dbToComponentMember);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch members";
      toast.add({
        title: "Error Loading Members",
        description: error.value,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
    } finally {
      loading.value = false;
    }
  };

  // Add a new member
  const addMember = async (name: string): Promise<boolean> => {
    if (!user.value) return false;

    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("members")
        .insert({
          name,
          user_id: user.value.id,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Add to local state
      members.value.push(dbToComponentMember(data));

      toast.add({
        title: "Member Added",
        description: `${name} has been added to your members.`,
        color: "success",
        icon: "i-heroicons-check-circle",
      });

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to add member";
      toast.add({
        title: "Error Adding Member",
        description: error.value,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Remove a member
  const removeMember = async (memberId: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("members")
        .delete()
        .eq("id", memberId);

      if (deleteError) {
        throw deleteError;
      }

      // Remove from local state
      const index = members.value.findIndex((m) => m.id === memberId);
      if (index !== -1) {
        const removedMember = members.value[index];
        if (removedMember) {
          members.value.splice(index, 1);

          toast.add({
            title: "Member Removed",
            description: `${removedMember.name} has been removed from your members.`,
            color: "success",
            icon: "i-heroicons-check-circle",
          });
        }
      }

      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to remove member";
      toast.add({
        title: "Error Removing Member",
        description: error.value,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Update a member
  const updateMember = async (
    memberId: string,
    name: string
  ): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      const { error: updateError } = await supabase
        .from("members")
        .update({ name })
        .eq("id", memberId);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      const member = members.value.find((m) => m.id === memberId);
      if (member) {
        member.name = name;

        toast.add({
          title: "Member Updated",
          description: `Member name has been updated to ${name}.`,
          color: "success",
          icon: "i-heroicons-check-circle",
        });
      }

      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update member";
      toast.add({
        title: "Error Updating Member",
        description: error.value,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Update member checked state (UI state only)
  const updateMemberChecked = (memberId: string, checked: boolean) => {
    const member = members.value.find((m) => m.id === memberId);
    if (member) {
      member.checked = checked;
    }
  };

  // Fetch on mount
  onMounted(() => {
    fetchMembers();
  });

  return {
    members: readonly(members),
    loading: readonly(loading),
    error: readonly(error),
    fetchMembers,
    addMember,
    removeMember,
    updateMember,
    updateMemberChecked,
  };
}

export const useMembers = () => {
  // Return singleton instance
  if (!membersState) {
    membersState = createMembersState();
  }
  return membersState;
};
