<template>
  <template v-if="receiptStatus === 'success'">
    <div class="container mx-auto mt-6">
      <div class="flex items-center mb-6">
        <UButton
          variant="link"
          color="secondary"
          class="p-2 mr-2 cursor-pointer"
          @click="navigateTo('/')"
        >
          <UIcon name="i-heroicons-chevron-left" :size="24" />
          <span class="ml-2">Receipts</span>
        </UButton>
      </div>

      <div class="bg-gray-800 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <h2>{{ receipt?.title ?? "Unknown" }}</h2>
          </div>
        </div>
      </div>

      <!-- Receipt Items -->
      <div class="mb-6">
        <div
          class="flex justify-between items-center mb-3 pb-3 border-b border-gray-700"
        >
          <h3 class="font-medium mb-3">Receipt</h3>

          <div class="flex items-center">
            <UAvatarGroup class="mr-4">
              <UAvatar
                v-for="member in members"
                v-show="member.checked"
                :key="member.id"
                :alt="member.name"
              />
            </UAvatarGroup>
            <UDropdownMenu
              :items="memberItems"
              :content="{ align: 'start' }"
              :ui="{ content: 'w-48' }"
            >
              <UButton
                label="Members"
                color="primary"
                variant="outline"
                icon="i-lucide-users"
              />
            </UDropdownMenu>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg py-4 px-2 mb-4 space-y-2">
          <!-- Receipt Header -->
          <div
            class="flex justify-between items-center px-4 pb-3 border-b border-gray-700"
          >
            <div class="flex items-center">
              <div>
                <h4 class="font-medium">{{ receipt?.vendor ?? "Unknown" }}</h4>
                <span class="text-xs text-gray-400">
                  {{ formatDate(receipt?.uploaded_at ?? "") }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <span class="font-semibold text-lg">{{
                formatCurrency(
                  receipt?.total_cost || 0,
                  receipt?.currency,
                  receipt?.locale
                )
              }}</span>
              <div class="text-xs text-gray-400">
                {{ fields?.length ?? 0 }} items
              </div>
            </div>
          </div>

          <!-- Receipt Line Items -->
          <div class="space-y-1">
            <div
              v-for="(field, idx) in fields"
              :name="`items.${idx}.title`"
              :key="field.key"
              class="relative flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors h-12 overflow-hidden"
              @click="assignMembersToItemHandler(idx)"
            >
              <div
                :class="{ 'bg-blue-800': fieldItems[idx]?.left > 75 }"
                class="absolute top-0 left-0 w-1/4 h-full bg-blue-500/30 flex items-center justify-center z-10 rounded gap-x-2"
              >
                <UIcon name="i-lucide-edit" :size="16" />
                <span class="text-white font-medium">Edit</span>
              </div>
              <div
                :ref="el => setTargetRef(idx, el as HTMLElement)"
                :class="{ 'transition-none': fieldItems[idx]?.isSwiping }"
                :style="{ left: `${fieldItems[idx]?.left}px` }"
                class="absolute top-0 left-0 w-full h-full flex items-center justify-between z-20 bg-gray-800 px-4"
              >
                <div class="flex items-center space-x-2">
                  <UButton
                    v-if="!isMobile"
                    variant="ghost"
                    icon="lucide:edit"
                    @click.stop="
                      editItem.id = field.value.id;
                      editItem.title = field.value.title;
                      editItem.cost = field.value.cost;
                      editItem.fieldIndex = idx;
                      editDrawerOpen = true;
                    "
                    class="ml-2 cursor-pointer hover:text-blue-500"
                  />
                  <div class="font-medium">{{ field.value.title }}</div>
                  <UAvatarGroup
                    v-if="
                      field.value.assignments &&
                      field.value.assignments.length > 0
                    "
                    class="ml-2"
                  >
                    <UAvatar
                      v-for="assignment in field.value.assignments"
                      :key="assignment.user_name"
                      :alt="assignment.user_name"
                    />
                  </UAvatarGroup>
                </div>
                <div class="flex items-center">
                  <div class="font-medium">
                    {{
                      formatCurrency(
                        field.value.cost || 0,
                        receipt?.currency,
                        receipt?.locale
                      )
                    }}
                  </div>
                  <UButton
                    v-if="!isMobile"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    @click.stop="handleDeleteItem(idx)"
                    class="ml-2 cursor-pointer hover:text-red-500"
                  />
                </div>
              </div>
              <div
                :class="{ 'bg-red-800': fieldItems[idx]?.left < -75 }"
                class="absolute top-0 right-0 w-1/4 h-full bg-red-500/30 flex items-center justify-center z-10 rounded gap-x-2"
              >
                <span class="text-white font-medium">Delete</span>
                <UIcon name="i-heroicons-trash" :size="16" />
              </div>
            </div>
          </div>

          <!-- Total cost as a sanity check -->
          <div class="border-t border-b border-gray-700 py-6">
            <div class="flex items-center justify-between mx-4">
              <div class="font-medium text-gray-300">Total</div>
              <div class="flex items-center">
                <div class="font-medium">
                  {{
                    formatCurrency(
                      parseFloat(totalCost),
                      receipt?.currency,
                      receipt?.locale
                    )
                  }}
                </div>
                <UIcon
                  :name="
                    totalCost === receipt?.total_cost?.toFixed(2).toString()
                      ? 'i-lucide-check-circle'
                      : 'i-lucide-x-circle'
                  "
                  class="ml-2"
                  :class="
                    totalCost === receipt?.total_cost?.toFixed(2).toString()
                      ? 'text-green-500'
                      : 'text-red-500'
                  "
                />
              </div>
            </div>
          </div>

          <!-- Receipt Actions -->
          <div class="flex space-x-2 mt-4 px-2">
            <UButton
              icon="i-lucide-users"
              class="flex-1 bg-gray-700 text-white py-2 rounded text-sm flex items-center justify-center"
              @click="memberDrawerOpen = true"
            >
              <span class="ml-2">Members</span>
            </UButton>
            <UButton
              icon="i-lucide-plus"
              color="secondary"
              class="flex-1 text-white py-2 rounded text-sm flex items-center justify-center"
              @click="handleAddItem"
            >
              Add Item
            </UButton>
          </div>
          <div class="flex justify-between items-center px-2">
            <UButton
              icon="i-lucide-chart-bar"
              class="flex-1 py-2 bg-gray-700 text-white rounded text-sm flex items-center justify-center"
              :to="`/summary/${id}`"
            >
              Summary
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <DrawerMembers
      :open="memberDrawerOpen"
      :members="members"
      @close="memberDrawerOpen = false"
      @removeMember="removeMember"
      @addMember="addMember"
    />

    <DrawerEditItem
      :open="editDrawerOpen"
      :item="editItem"
      :field-index="editItem.fieldIndex"
      :set-field-value="setFieldValue"
      :members="members"
      :current-assignments="
        fields[editItem.fieldIndex]?.value.assignments || []
      "
      @close="editDrawerOpen = false"
      @save="handleEditItemSave"
      @open-member-drawer="memberDrawerOpen = true"
    />
  </template>

  <template v-else-if="loading">
    <Loading />
  </template>
</template>

<script setup lang="ts">
import type { UseSwipeDirection } from "@vueuse/core";
import { useSwipe } from "@vueuse/core";
import { shallowRef } from "vue";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useFieldArray, useForm } from "vee-validate";
import type {
  ReceiptEditForm,
  ReceiptItemForm,
  ReceiptMember,
  fieldItemsSwipe,
} from "~~/types/receipts";
import { formatCurrency } from "~~/utils/currency";
import { formatDate } from "~~/utils/formatDate";

const route = useRoute();
const toast = useToast();
const supabase = useSupabaseClient();

// Get the route parameter
const id = route.params.id;
const memberDrawerOpen = ref(false);
const editDrawerOpen = ref(false);
const editItem = reactive({ id: 0, title: "", cost: 0.0, fieldIndex: 0 });

const { isMobile } = useDevice();

// Use the composable
const {
  receipt,
  receiptItems,
  status: receiptStatus,
  loading,
} = useGetReceipt(id as string);

const { handleSubmit, resetForm, values, setFieldValue } =
  useForm<ReceiptEditForm>({ initialValues: {} });

const { remove, push, fields, update } =
  useFieldArray<ReceiptItemForm>("items");

// Use the reusable member assignment function
const { assignMembersToItem } = useMemberAssignment();

// Store refs for each target
const targetRefs = shallowRef<(HTMLElement | null)[]>([]);

const setTargetRef = (index: number, el: HTMLElement | null) => {
  targetRefs.value[index] = el;
};

const fieldItems = ref<fieldItemsSwipe[]>([]);

watch(
  () => fields.value.length,
  () => {
    fieldItems.value = Array.from({ length: fields.value.length }, (_, i) => ({
      id: i + 1,
      left: 0,
      direction: null,
      lengthX: 0,
      isSwiping: false,
    }));

    // Recreate swipe handlers for all items
    nextTick(() => {
      fieldItems.value.forEach((_, index) => {
        createSwipeHandler(index);
      });
    });
  }
);

// Create swipe handlers for each item
const createSwipeHandler = (index: number) => {
  const target = computed(() => targetRefs.value[index]);

  const { direction, isSwiping, lengthX, stop } = useSwipe(target, {
    passive: false,
    onSwipe() {
      const maxSwipeDistance = 90;
      const clampedLengthX = Math.max(
        -maxSwipeDistance,
        Math.min(maxSwipeDistance, lengthX.value)
      );
      const length = -clampedLengthX;
      fieldItems.value[index]!.left = length;
      fieldItems.value[index]!.lengthX = clampedLengthX;
      fieldItems.value[index]!.isSwiping = isSwiping.value;
    },
    onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
      fieldItems.value[index]!.left = 0;
      fieldItems.value[index]!.isSwiping = false;
      fieldItems.value[index]!.direction = direction;

      if (Math.abs(lengthX.value) > 75) {
        // Handle actions based on direction
        if (direction === "left") {
          handleDeleteItem(index);
        } else if (direction === "right") {
          editItem.id = fields.value[index].value.id;
          editItem.title = fields.value[index]?.value.title ?? "";
          editItem.cost = fields.value[index]?.value.cost ?? 0.0;
          editItem.fieldIndex = index;
          editDrawerOpen.value = true;
        }
      }
    },
  });

  // Watch for changes and update the item
  watch(direction, (newDirection) => {
    fieldItems.value[index]!.direction = newDirection;
  });

  watch(isSwiping, (newIsSwiping) => {
    fieldItems.value[index]!.isSwiping = newIsSwiping;
  });

  watch(lengthX, (newLengthX) => {
    fieldItems.value[index]!.lengthX = newLengthX;
  });
};

const totalCost = computed(() => {
  return fields.value
    .reduce((acc, field) => acc + field.value.cost, 0)
    .toFixed(2);
});

// Reset form when receipt items are successfully loaded
watch(
  [receiptStatus, receiptItems],
  async () => {
    if (
      receiptStatus.value === "success" &&
      receiptItems.value &&
      !values.items
    ) {
      // Fetch receipt with all items and assignments using join
      const receiptData = await fetchReceiptWithItemsAndAssignments();

      if (receiptData && receiptData.receipt_items) {
        // Map receipt items with their assignments to the form format
        const itemsWithAssignments = receiptData.receipt_items.map(
          (item: any) => ({
            id: item.id,
            title: item.title,
            cost: item.cost,
            assignments: (item.receipt_item_assignments || []).map(
              (assignment: any) => ({
                id: assignment.id,
                user_name: assignment.user_name,
                method: assignment.method,
                value: assignment.value,
              })
            ),
          })
        );

        // Reset form with populated data
        resetForm({ values: { items: itemsWithAssignments } });
      } else {
        // Fallback to original receipt items if join query fails
        resetForm({ values: { items: receiptItems.value } });
      }
    }
  },
  { immediate: true }
);

const createMemberItems = () => {
  const items: DropdownMenuItem[] = [
    {
      label: "Members",
      icon: "i-lucide-users",
      type: "label",
    },
  ];

  if (members.value.length > 0) {
    items.push({ type: "separator" });
  }

  items.push(
    ...(members.value.map((member) => ({
      label: member.name,
      type: "checkbox",
      avatar: {
        alt: member.name,
      },
      checked: member.checked,
      onUpdateChecked(checked: boolean) {
        member.checked = checked;
      },
      onSelect(e: Event) {
        e.preventDefault();
      },
    })) as DropdownMenuItem[])
  );

  if (members.value.length > 0) {
    items.push({ type: "separator" } as DropdownMenuItem);
  }

  items.push({
    label: "Manage Members",
    icon: "i-lucide-user-plus",
    onClick: () => {
      memberDrawerOpen.value = true;
    },
  });

  return items;
};

const memberItems = computed(createMemberItems);

const members = ref<ReceiptMember[]>([
  { id: 1, name: "John Doe", amount: 100, checked: false },
  { id: 2, name: "Jane Smith", amount: 200, checked: false },
  { id: 3, name: "Bob Johnson", amount: 150, checked: false },
]);

const removeMember = (id: number) => {
  members.value = members.value.filter((member) => member.id !== id);
};

const addMember = (newMember: ReceiptMember) => {
  members.value.push(newMember);
};

const handleEditItemSave = async (
  fieldIndex: number,
  updatedItem: ReceiptItemForm
) => {
  // Get the current item to preserve its ID
  const currentItem = fields.value[fieldIndex];
  if (!currentItem) return;

  // Preserve the original ID and merge with updated data
  const itemWithId = {
    ...updatedItem,
    id: currentItem.value.id, // Preserve the original ID
  };

  // Update the field array item using the update method
  update(fieldIndex, itemWithId);

  // Persist the changes to the database using upsert
  const { error } = await supabase.from("receipt_items").upsert({
    id: currentItem.value.id,
    receipt_id: id,
    title: updatedItem.title,
    cost: updatedItem.cost,
  });

  if (error) {
    toast.add({
      title: "Error Saving Item",
      description: `Failed to save item changes: ${error.message}`,
      color: "red",
      icon: "i-heroicons-x-circle",
    });
    return;
  }
};

const assignMembersToItemHandler = (idx: number) => {
  // Get all selected members
  const selectedMembers = members.value.filter((member) => member.checked);

  if (selectedMembers.length === 0) {
    toast.add({
      title: "No Members Selected",
      description:
        "Please select at least one member from the dropdown before assigning to items.",
      color: "yellow",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }

  // Get the current item
  const currentItem = fields.value[idx];
  if (!currentItem) return;

  // Use the reusable function to assign members
  const updatedItem = assignMembersToItem(currentItem.value, selectedMembers);

  // Update the field array item
  update(idx, updatedItem);
};

// Function to fetch receipt with all items and assignments
async function fetchReceiptWithItemsAndAssignments() {
  try {
    const { data, error } = await supabase
      .from("receipts")
      .select(
        `
        *,
        receipt_items (
          *,
          receipt_item_assignments (*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      toast.add({
        title: "Error Loading Receipt",
        description:
          "Failed to load receipt data. Please try refreshing the page.",
        color: "red",
        icon: "i-heroicons-x-circle",
      });
      return null;
    }

    // Sort receipt_items by created_at ascending (oldest first)
    if (data?.receipt_items) {
      data.receipt_items.sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateA.getTime() - dateB.getTime();
      });
    }

    return data;
  } catch (error) {
    toast.add({
      title: "Error Loading Receipt",
      description: "An unexpected error occurred while loading the receipt.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });

    return null;
  }
}

const handleAddItem = async () => {
  try {
    // Create the receipt item in the database first
    const { data: newItem, error } = await supabase
      .from("receipt_items")
      .insert({
        receipt_id: id,
        title: "New Item",
        cost: 0,
      })
      .select()
      .single();

    if (error) {
      toast.add({
        title: "Error Adding Item",
        description: "Failed to create new item. Please try again.",
        color: "red",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    // Add the new item to the form with the database ID
    push({
      id: newItem.id,
      title: newItem.title,
      cost: newItem.cost,
      assignments: [],
    } as ReceiptItemForm);
  } catch (error) {
    toast.add({
      title: "Error Adding Item",
      description: "An unexpected error occurred while creating the item.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
  }
};

// Custom delete function that removes from both form and database
const handleDeleteItem = async (index: number) => {
  const itemToDelete = fields.value[index];
  if (!itemToDelete) return;

  try {
    // Delete from database first
    const { error } = await supabase
      .from("receipt_items")
      .delete()
      .eq("id", itemToDelete.value.id);

    if (error) {
      toast.add({
        title: "Error Deleting Item",
        description: `Failed to delete item from database: ${error.message}`,
        color: "red",
        icon: "i-heroicons-x-circle",
      });
      return;
    }

    // Remove from form state
    remove(index);
  } catch (error) {
    toast.add({
      title: "Error Deleting Item",
      description: "An unexpected error occurred while deleting the item.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
  }
};
</script>
