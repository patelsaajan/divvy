<template>
  <UDrawer
    v-model:open="isOpen"
    should-scale-background
    inset
    set-background-color-on-scale
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
        >
          Edit Item
        </h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="emit('close')"
        />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-y-4 min-h-[75vh]">
        <UForm :state="formState" class="flex flex-col gap-y-4">
          <UFormField label="Title" required>
            <UInput v-model="formState.title" />
          </UFormField>
          <UFormField label="Cost" required>
            <UInputNumber
              v-model="formState.cost"
              :min="0"
              :step="0.5"
              :precision="2"
              :format-options="{
                style: 'currency',
                currency: 'GBP',
                currencyDisplay: 'symbol',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }"
            />
          </UFormField>
        </UForm>

        <!-- Member Splitting Section -->
        <div
          class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4"
        >
          <div class="flex justify-between items-center">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Split By
            </h4>
            <!-- Segmented Control -->
            <div class="flex items-center gap-1">
              <UButton
                label="Split evenly"
                variant="ghost"
                @click="splitEvenly"
              />
              <div
                class="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <UButton
                  icon="i-lucide-percent"
                  :variant="splitMethod === 'percentage' ? 'solid' : 'ghost'"
                  :color="splitMethod === 'percentage' ? 'primary' : 'gray'"
                  @click="switchSplitMethod('percentage')"
                />
                <UButton
                  icon="i-lucide-pound-sterling"
                  :variant="splitMethod === 'amount' ? 'solid' : 'ghost'"
                  :color="splitMethod === 'amount' ? 'primary' : 'gray'"
                  @click="switchSplitMethod('amount')"
                />
              </div>
            </div>
          </div>

          <!-- Assigned Members List -->
          <div class="space-y-3">
            <div
              v-for="assignment in formState.assignments"
              :key="assignment.user_name"
              class="flex items-center gap-3"
            >
              <UAvatar :alt="assignment.user_name" size="sm" />
              <span
                class="flex-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ assignment.user_name }}
              </span>

              <!-- Input for Percentage Split -->
              <template
                v-if="splitMethod === 'percentage'"
                :key="assignment.user_name + '-percentage'"
                class="flex items-center gap-2"
              >
                <UInputNumber
                  :model-value="assignment.value"
                  :min="0"
                  :step="0.01"
                  :precision="4"
                  class="w-32"
                  @update:model-value="(val: number) => onAmountChange(assignment, val)"
                  :format-options="{
                    style: 'percent',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }"
                />
                <span class="w-16 text-right text-sm text-gray-500">{{
                  formatCurrency(formState.cost * (assignment.value || 0))
                }}</span>
              </template>

              <!-- Input for Amount Split -->
              <template
                v-if="splitMethod === 'amount'"
                :key="assignment.user_name + '-amount'"
              >
                <UInputNumber
                  :model-value="assignment.value"
                  :min="0"
                  :step="0.01"
                  :precision="2"
                  :format-options="{ style: 'currency', currency: 'GBP' }"
                  class="w-32"
                  @update:model-value="(val: number) => onAmountChange(assignment, val)"
                />
              </template>

              <UButton
                icon="i-heroicons-x-mark-20-solid"
                variant="ghost"
                @click="removeMember(assignment.user_name)"
              />
            </div>
            <div
              v-if="formState.assignments.length === 0"
              class="text-center text-sm text-gray-500 py-4"
            >
              Add members to start splitting the cost.
            </div>
          </div>
          <div
            v-if="formState.assignments.length > 0"
            class="mt-3 p-2 rounded-md text-sm transition-colors"
            :class="totalValidation.class"
          >
            <span class="font-medium">{{ totalValidation.message }}</span>
            <span class="text-xs ml-2">
              Total:
              <template v-if="splitMethod === 'percentage'"
                >{{ (totalAmount * 100).toFixed(0) }}% / 100%</template
              >
              <template v-else
                >{{ formatCurrency(totalAmount) }} /
                {{ formatCurrency(formState.cost) }}</template
              >
            </span>
          </div>

          <!-- Other Members -->
          <div>
            <h4
              class="text-sm font-medium text-gray-900 dark:text-white mb-2 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              Add other members
            </h4>
            <div class="flex flex-wrap items-center gap-2">
              <UButton
                v-for="member in unassignedMembers"
                :key="member.id"
                variant="text"
                class="p-1"
                @click="addMember(member)"
              >
                <UAvatar :alt="member.name" size="xl" />
              </UButton>
              <UButton
                icon="i-heroicons-user-plus"
                variant="ghost"
                size="xl"
                class="rounded-full"
                @click="handleManageMembersClick"
              />
            </div>
          </div>
        </div>
      </div>

      <UButton
        @click="handleSave"
        :loading="isSaving"
        class="mt-4 w-full flex items-center justify-center gap-2 rounded-full"
      >
        <UIcon name="i-heroicons-pencil" />
        Save
      </UButton>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type {
  ReceiptItemForm,
  ReceiptMember,
  ReceiptItemAssignmentForm,
} from "~~/types/receipts";
import {
  formatCurrency,
  distributeAmountEvenly,
  distributePercentageEvenly,
} from "~~/utils/currency";

const props = defineProps<{
  open: boolean;
  item: { id: number; title: string; cost: number };
  fieldIndex?: number;
  setFieldValue?: (field: string, value: any) => void;
  members?: ReceiptMember[];
  currentAssignments?: ReceiptItemAssignmentForm[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", fieldIndex: number, updatedItem: ReceiptItemForm): void;
  (e: "open-member-drawer"): void;
}>();

const toast = useToast();
const isSaving = ref(false);

const formState = ref<ReceiptItemForm>({
  title: "",
  cost: 0,
  assignments: [],
});

const splitMethod = ref<"percentage" | "amount">("percentage");

// --- Lifecycle and Watchers ---

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      // Create deep copies to prevent reactivity issues.
      formState.value.title = JSON.parse(JSON.stringify(props.item.title));
      formState.value.cost = JSON.parse(JSON.stringify(props.item.cost));
      formState.value.assignments = JSON.parse(
        JSON.stringify(props.currentAssignments || [])
      );

      const firstAssignmentMethod = props.currentAssignments?.[0]?.method;

      if (firstAssignmentMethod === "custom") {
        // If loaded assignments are 'custom', the values are already amounts.
        splitMethod.value = "amount";
      } else {
        // If 'equal', the values are amounts that need conversion to percentage fractions.
        splitMethod.value = "percentage";
        const cost = formState.value.cost;
        if (cost > 0) {
          formState.value.assignments.forEach((a) => {
            a.value = a.value / cost;
          });
        }
      }
    }
  },
  { immediate: true }
);

// --- Member Management ---

const unassignedMembers = computed(() => {
  const assignedNames = formState.value.assignments.map((a) => a.user_name);
  return (props.members || []).filter((m) => !assignedNames.includes(m.name));
});

function addMember(member: ReceiptMember) {
  formState.value.assignments.push({
    user_name: member.name,
    method: splitMethod.value === "percentage" ? "equal" : "custom",
    value: 0,
    numerator: 1,
    denominator: 1,
  });
  splitEvenly();
}

function removeMember(userName: string) {
  formState.value.assignments = formState.value.assignments.filter(
    (a) => a.user_name !== userName
  );
  splitEvenly();
}

// --- Calculation Logic ---

function switchSplitMethod(
  method: "percentage" | "amount",
  convertValues = true
) {
  const cost = formState.value.cost;
  if (convertValues && cost > 0) {
    formState.value.assignments.forEach((a) => {
      if (method === "percentage") {
        a.value = a.value / cost;
      } else {
        a.value = a.value * cost;
      }
    });
  }
  splitMethod.value = method;
}

function splitEvenly() {
  const numAssignments = formState.value.assignments.length;
  if (numAssignments === 0) return;

  if (splitMethod.value === "percentage") {
    const distributedPercentages = distributePercentageEvenly(numAssignments);
    formState.value.assignments.forEach((assignment, index) => {
      assignment.value = distributedPercentages[index] || 0;
    });
  } else {
    const distributedAmounts = distributeAmountEvenly(
      formState.value.cost,
      numAssignments
    );
    formState.value.assignments.forEach((assignment, index) => {
      assignment.value = distributedAmounts[index] || 0;
    });
  }
}

function onAmountChange(
  assignmentToUpdate: ReceiptItemAssignmentForm,
  newValue: number | null
) {
  const value = newValue === null ? 0 : newValue;
  const otherAssignmentsSum = formState.value.assignments
    .filter((a) => a.user_name !== assignmentToUpdate.user_name)
    .reduce((sum, current) => sum + (current.value || 0), 0);

  const limit = splitMethod.value === "percentage" ? 1 : formState.value.cost;
  const maxNewValue = limit - otherAssignmentsSum;

  assignmentToUpdate.value = Math.min(value, maxNewValue < 0 ? 0 : maxNewValue);
}

// --- Validation ---

const totalAmount = computed(() => {
  return formState.value.assignments.reduce(
    (sum, a) => sum + (a.value || 0),
    0
  );
});

const totalValidation = computed(() => {
  const total = totalAmount.value;
  const cost = formState.value.cost;
  const Epsilon = 0.0001;

  if (splitMethod.value === "percentage") {
    if (Math.abs(total - 1) < Epsilon)
      return {
        class: "bg-green-100 dark:bg-green-900/50",
        message: "Perfect! Total is 100%.",
      };
    if (total > 1)
      return {
        class: "bg-red-100 dark:bg-red-900/50",
        message: "Total exceeds 100%.",
      };
    return {
      class: "bg-yellow-100 dark:bg-yellow-900/50",
      message: "Total is less than 100%.",
    };
  } else {
    if (Math.abs(total - cost) < Epsilon)
      return {
        class: "bg-green-100 dark:bg-green-900/50",
        message: "Perfect! Total matches item cost.",
      };
    if (total > cost)
      return {
        class: "bg-red-100 dark:bg-red-900/50",
        message: "Total exceeds item cost.",
      };
    return {
      class: "bg-yellow-100 dark:bg-yellow-900/50",
      message: "Total is less than item cost.",
    };
  }
});

// --- Actions ---

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => !value && emit("close"),
});

async function handleManageMembersClick() {
  const savedSuccessfully = await handleSave();
  if (savedSuccessfully) {
    emit("open-member-drawer");
  }
}

const handleSave = async (): Promise<boolean> => {
  if (props.fieldIndex === undefined) return false;

  const total = totalAmount.value;
  const cost = formState.value.cost;
  let isValid = true;
  let errorMessage = "";

  if (splitMethod.value === "percentage" && Math.abs(total - 1) > 0.01) {
    isValid = false;
    errorMessage = "Total percentage must be exactly 100%.";
  } else if (splitMethod.value === "amount" && Math.abs(total - cost) > 0.01) {
    isValid = false;
    errorMessage = "Total amount must exactly match the item cost.";
  }

  if (!isValid) {
    toast.add({
      title: "Cannot Save",
      description: errorMessage,
      color: "red",
      icon: "i-heroicons-x-circle",
    });
    return false;
  }

  // Set method for persistence
  formState.value.assignments.forEach((a) => {
    a.method = splitMethod.value === "percentage" ? "equal" : "custom";
  });

  isSaving.value = true;
  try {
    // By creating a deep copy, we break the reactive link.
    const itemToSave = JSON.parse(JSON.stringify(formState.value));
    emit("save", props.fieldIndex, itemToSave);
    emit("close");
    return true;
  } catch (error) {
    console.error("Error saving item:", error);
    return false;
  } finally {
    isSaving.value = false;
  }
};
</script>
