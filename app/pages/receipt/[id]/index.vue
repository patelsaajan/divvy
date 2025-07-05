<template>
  <template v-if="receiptStatus === 'success'">
    <div class="container mx-auto">
      <PageBackButton content="Receipts" :link="paths.home" class="mb-6" />

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
                class="cursor-pointer"
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
                {{ receiptItemsWithAssignments?.length ?? 0 }} items
              </div>
            </div>
          </div>

          <!-- Receipt Line Items -->
          <div class="space-y-1">
            <div
              v-for="(item, idx) in receiptItemsWithAssignments"
              :key="item.id"
              class="relative flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors h-12 overflow-hidden"
              @click="assignMembersToItemHandler(idx)"
            >
              <div
                :class="{ 'bg-blue-800': fieldItems[idx]?.left && fieldItems[idx]!.left > 75 }"
                class="absolute top-0 left-0 w-1/4 h-full bg-blue-500/30 flex items-center justify-center z-10 rounded gap-x-2"
              >
                <UIcon name="i-lucide-edit" :size="16" />
                <span class="text-white font-medium">Edit</span>
              </div>
              <div
                :ref="el => setTargetRef(idx, el as HTMLElement)"
                :class="{ 'transition-none': fieldItems[idx]?.isSwiping }"
                :style="{ left: `${fieldItems[idx]?.left || 0}px` }"
                class="absolute top-0 left-0 w-full h-full flex items-center justify-between z-20 bg-gray-800 px-4"
              >
                <div class="flex items-center space-x-2">
                  <UButton
                    v-if="!isMobile"
                    variant="ghost"
                    icon="lucide:edit"
                    @click.stop="
                      editItem = {
                        id: item.id,
                        title: item.title,
                        cost: item.cost,
                        assignments: item.assignments || [],
                      }
                    "
                    class="ml-2 cursor-pointer hover:text-blue-500"
                  />
                  <div class="font-medium">{{ item.title }}</div>
                  <UAvatarGroup
                    v-if="item.assignments && item.assignments.length > 0"
                    :key="`${item.id}-${assignmentsHash}`"
                    class="ml-2"
                  >
                    <UAvatar
                      v-for="assignment in item.assignments"
                      :key="assignment.user_name"
                      :alt="assignment.user_name"
                    />
                  </UAvatarGroup>
                </div>
                <div class="flex items-center">
                  <div class="font-medium">
                    {{
                      formatCurrency(
                        item.cost || 0,
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
                :class="{ 'bg-red-800': fieldItems[idx]?.left && fieldItems[idx]!.left < -75 }"
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
              variant="soft"
              icon="i-lucide-users"
              class="flex-1 text-white py-2 rounded text-sm flex items-center justify-center cursor-pointer"
              @click="memberDrawerOpen = true"
            >
              Members
            </UButton>
            <UButton
              icon="i-lucide-plus"
              color="secondary"
              class="flex-1 text-white py-2 rounded text-sm flex items-center justify-center cursor-pointer"
              @click="handleAddItem"
            >
              Add Item
            </UButton>
          </div>
          <div class="flex justify-between items-center px-2">
            <UButton
              variant="soft"
              icon="i-lucide-chart-bar"
              class="flex-1 py-2 text-white rounded text-sm flex items-center justify-center cursor-pointer"
              :to="`/summary/${id}`"
            >
              Summary
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <DrawerMembers :open="memberDrawerOpen" @close="memberDrawerOpen = false" />

    <DrawerEditItem
      v-if="editItem"
      :open="!!editItem"
      :item="editItem"
      :receipt-id="id"
      @close="editItem && (editItem = null)"
      @open-member-drawer="memberDrawerOpen = true"
    />
  </template>

  <template v-else-if="loading">
    <Loading />
  </template>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { UseSwipeDirection } from "@vueuse/core";
import { useSwipe } from "@vueuse/core";
import { computed, nextTick, ref, watch } from "vue";
import { useMembers } from "~/composables/useMembers";
import { useReceipt } from "~/composables/useReceipt";
import { useReceiptItemAssignments } from "~/composables/useReceiptItemAssignments";
import { useReceiptItems } from "~/composables/useReceiptItems";
import type {
  FieldItemsSwipe,
  ReceiptItemAssignmentForm,
  ReceiptItemForm,
} from "~~/types/receipts";
import { distributeAmountEvenly, formatCurrency } from "~~/utils/currency";
import { formatDate } from "~~/utils/formatDate";
import { paths } from "~~/utils/paths";

definePageMeta({ layout: false });
import { ModalsConfirmation } from '#components'

const route   = useRoute();
const toast   = useToast();
const overlay = useOverlay();
const { isMobile } = useDevice();

// Get the route parameter
const id = route.params.id as string;
const memberDrawerOpen = ref(false);

const editItem = ref<ReceiptItemForm | null>(null);

// Use the composables
const { receipt, receiptLoading } = useReceipt(id);
const { members, updateMemberChecked } = useMembers();
const { toggleMembersForItem } = useMemberAssignment();

const {
  receiptItems,
  receiptItemsLoading,
  createReceiptItem,
  deleteReceiptItem,
} = useReceiptItems(id);

const { assignmentsMap, assignmentsLoading, updateAssignments } =
  useReceiptItemAssignments(id);

// TODO: Find a better way to force re-render the avatar group
// Create a hash of the assignments map for tracking changes
const assignmentsHash = computed(() => {
  if (!assignmentsMap.value) return "";

  // Create a simple hash by stringifying the assignments map
  const assignmentsString = JSON.stringify(assignmentsMap.value);
  return btoa(assignmentsString).slice(0, 8); // Use base64 and take first 8 chars
});

// Computed properties for compatibility
const loading = computed(
  () =>
    receiptLoading.value ||
    receiptItemsLoading.value ||
    assignmentsLoading.value
);

const receiptStatus = computed(() => {
  if (loading.value) return "loading";
  if (receipt.value && receiptItems.value) return "success";
  return "idle";
});

// Store refs for each target
const targetRefs = ref<(HTMLElement | null)[]>([]);

const setTargetRef = (index: number, el: HTMLElement | null) => {
  targetRefs.value[index] = el;
};

const fieldItems = ref<FieldItemsSwipe[]>([]);

// Create a reactive computed property for receipt items with assignments
const receiptItemsWithAssignments = computed(() => {
  if (!receiptItems.value) return [];

  const result = receiptItems.value.map((item) => {
    // Access assignments in a way that Vue can track
    const itemAssignments =
      (assignmentsMap.value as Record<string, ReceiptItemAssignmentForm[]>)?.[
        item.id
      ] || [];

    return {
      id: item.id,
      title: item.title,
      cost: item.cost,
      assignments: itemAssignments,
    };
  });

  return result;
});

watch(
  () => receiptItemsWithAssignments.value.length,
  () => {
    fieldItems.value = Array.from(
      { length: receiptItemsWithAssignments.value.length },
      (_, i) => ({
        id: i + 1,
        left: 0,
        direction: null,
        lengthX: 0,
        isSwiping: false,
      })
    );

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
          const currentItem = receiptItemsWithAssignments.value[index];
          if (currentItem) {
            editItem.value = {
              id: currentItem.id,
              title: currentItem.title ?? "",
              cost: currentItem.cost ?? 0.0,
              assignments: currentItem.assignments || [],
            };
          }
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
  return receiptItemsWithAssignments.value
    .reduce((acc: number, item: any) => acc + item.cost, 0)
    .toFixed(2);
});

const memberItems = computed(() => {
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
        updateMemberChecked(member.id, checked);
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
});

const assignMembersToItemHandler = async (idx: number) => {
  // Get all selected members
  const selectedMembers = members.value.filter((member) => member.checked);

  if (selectedMembers.length === 0) {
    toast.add({
      title: "No Members Selected",
      description:
        "Please select at least one member from the dropdown before assigning to items.",
      color: "warning",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }

  // Get the current item
  const currentItem = receiptItemsWithAssignments.value[idx];
  if (!currentItem) return;

  let newAssignments: ReceiptItemAssignmentForm[] = [];

  if (selectedMembers.length === 0) {
    // If no members are selected, clear all assignments
    newAssignments = [];
  } else {
    // Toggle members for the item
    const updatedItem = toggleMembersForItem(currentItem, selectedMembers);
    newAssignments = updatedItem.assignments || [];

    // Apply splitEvenly logic (same as edit drawer)
    if (newAssignments.length > 0) {
      const distributedAmounts = distributeAmountEvenly(
        currentItem.cost,
        newAssignments.length
      );

      newAssignments = newAssignments.map((assignment, index) => ({
        ...assignment,
        value: distributedAmounts[index] || 0,
        method: "percent",
      }));
    }
  }

  // Use the existing updateAssignments function (same as edit drawer)
  updateAssignments(
    currentItem.id,
    newAssignments,
    currentItem.assignments || []
  );
};

const handleAddItem = () => {
  const item = createReceiptItem("New Item", 0);

  if (!item) return;

  // Open edit item drawer
  editItem.value = { ...item, assignments: [] };
};

const modalDeleteConfirmation = overlay.create(ModalsConfirmation, {
  props: {
    title: "Delete Item",
    text: "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: () => {
      modalDeleteConfirmation.close();
    },
  },
});

const handleDeleteItem = (index: number) => {
  const itemToDelete = receiptItemsWithAssignments.value[index];
  if (!itemToDelete) return;

  modalDeleteConfirmation.open({
    title: "Delete Item",
    text: `Are you sure you want to delete ${itemToDelete.title}? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: () => {
      modalDeleteConfirmation.close();
      deleteReceiptItem(itemToDelete.id);
    },
  });
};
</script>
