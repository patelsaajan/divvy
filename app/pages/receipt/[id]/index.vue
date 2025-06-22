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
        <div class="bg-gray-800 rounded-lg py-4 px-2 mb-4">
          <!-- Receipt Header -->
          <div
            class="flex justify-between items-center mb-3 px-4 pb-3 border-b border-gray-700"
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
          <div class="space-y-2">
            <div
              v-for="(field, idx) in fields"
              :name="`items.${idx}.title`"
              :key="field.key"
              class="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
              @click="assignMembersToItem(idx)"
            >
              <div class="flex items-center space-x-2">
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
                  variant="ghost"
                  icon="i-lucide-trash"
                  @click.stop="remove(idx)"
                  class="ml-2 cursor-pointer hover:text-red-500"
                />
              </div>
            </div>
          </div>

          <!-- Calculate total cost as a sanity check -->
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
          <div class="flex space-x-2 mt-3 pt-3">
            <UButton
              class="flex-1 bg-gray-700 text-white py-2 rounded text-sm flex items-center justify-center"
              @click="drawerOpen = true"
            >
              <UIcon name="i-lucide-users" :size="16" class="inline mr-1" />
              <span class="ml-2">Members</span>
            </UButton>
            <UButton
              class="flex-1 bg-orange-500 text-white py-2 rounded text-sm flex items-center justify-center"
              @click="push({ title: 'New Item', cost: 0 } as ReceiptItemForm)"
            >
              <UIcon name="lucide:plus" :size="16" class="inline mr-1" />Add
              Item
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Members Drawer -->
    <UDrawer
      v-model:open="drawerOpen"
      should-scale-background
      set-background-color-on-scale
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Members
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="drawerOpen = false"
          />
        </div>
      </template>

      <template #body>
        <!-- Members -->
        <div class="space-y-4 min-h-[75vh]">
          <div
            v-for="person in members"
            :key="person.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <UAvatar :alt="person.name" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ person.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ${{ person.amount.toFixed(2) }}
                </p>
              </div>
            </div>
            <UButton
              variant="ghost"
              color="error"
              icon="i-heroicons-trash"
              @click="removeMember(person.id)"
            />
          </div>

          <!-- Add new member form -->
          <div
            class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <UInput
              v-model="newPerson"
              placeholder="Enter a name"
              class="flex-1"
              @keyup.enter="addPerson"
            />
            <UButton
              color="primary"
              icon="i-heroicons-plus"
              @click="addPerson"
              :disabled="!newPerson.trim()"
            >
              Add
            </UButton>
          </div>
        </div>
      </template>
    </UDrawer>
  </template>

  <template v-else-if="loading">
    <Loading />
  </template>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useFieldArray, useForm } from "vee-validate";
import type {
  ReceiptEditForm,
  ReceiptItemForm,
  ReceiptMember,
} from "~~/types/receipts";
import { formatCurrency } from "~~/utils/currency";
import { formatDate } from "~~/utils/formatDate";

// Get the route parameter
const route = useRoute();
const id = route.params.id;

// Use the composable
const {
  receipt,
  receiptItems,
  status: receiptStatus,
  loading,
} = useGetReceipt(id as string);

const { handleSubmit, resetForm, values, setFieldValue } =
  useForm<ReceiptEditForm>({ initialValues: {} });

const { remove, push, fields } = useFieldArray<ReceiptItemForm>("items");

const totalCost = computed(() => {
  return fields.value
    .reduce((acc, field) => acc + field.value.cost, 0)
    .toFixed(2);
});

// Reset form when receipt items are successfully loaded
watch(
  [receiptStatus, receiptItems],
  () => {
    if (
      receiptStatus.value === "success" &&
      receiptItems.value &&
      !values.items
    ) {
      resetForm({ values: { items: receiptItems.value } });
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
      drawerOpen.value = true;
    },
  });

  return items;
};

const memberItems = computed(createMemberItems);

const drawerOpen = ref(false);

const newPerson = ref("");

const members = ref<ReceiptMember[]>([
  { id: 1, name: "John Doe", amount: 100, checked: false },
  { id: 2, name: "Jane Smith", amount: 200, checked: false },
  { id: 3, name: "Bob Johnson", amount: 150, checked: false },
]);

const addPerson = () => {
  if (!newPerson.value.trim()) return;

  const newMember: ReceiptMember = {
    id: Date.now(),
    name: newPerson.value.trim(),
    amount: 0,
    checked: false,
  };

  members.value.push(newMember);
  newPerson.value = "";
};

const removeMember = (id: number) => {
  members.value = members.value.filter((member) => member.id !== id);
};

const assignMembersToItem = (idx: number) => {
  // Get all selected members
  const selectedMembers = members.value.filter((member) => member.checked);

  if (selectedMembers.length === 0) {
    console.log("No members selected");
    return;
  }

  // Get the current item
  const currentItem = fields.value[idx];
  if (!currentItem) return;

  // Get current assignments
  const currentAssignments = currentItem.value.assignments || [];
  const currentAssignedNames = currentAssignments.map((a) => a.user_name);

  // Create new assignments by toggling selected members
  let newAssignments = [...currentAssignments];

  selectedMembers.forEach((member) => {
    const isCurrentlyAssigned = currentAssignedNames.includes(member.name);

    if (isCurrentlyAssigned) {
      // Remove member from assignments
      newAssignments = newAssignments.filter(
        (a) => a.user_name !== member.name
      );
    } else {
      // Add member to assignments
      const newAssignment = {
        user_name: member.name,
        method: "equal" as const,
        numerator: 1,
        denominator: newAssignments.length + 1, // Will be updated after all additions
        value: 0,
      };
      newAssignments.push(newAssignment);
    }
  });

  // Update denominators for equal distribution
  if (newAssignments.length > 0) {
    newAssignments = newAssignments.map((assignment) => ({
      ...assignment,
      denominator: newAssignments.length,
    }));
  }

  // Update the item's assignments by updating the entire field
  const updatedItem = {
    ...currentItem.value,
    assignments: newAssignments,
  };

  // Use the field array's update method
  if (fields.value[idx]) {
    fields.value[idx].value = updatedItem;
  }
};
</script>
