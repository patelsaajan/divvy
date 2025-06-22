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
                  :variant="splitMethod === 'percent' ? 'solid' : 'ghost'"
                  :color="splitMethod === 'percent' ? 'primary' : 'neutral'"
                  @click="switchSplitMethod('percent')"
                />
                <UButton
                  icon="i-lucide-pound-sterling"
                  :variant="splitMethod === 'amount' ? 'solid' : 'ghost'"
                  :color="splitMethod === 'amount' ? 'primary' : 'neutral'"
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
                v-if="splitMethod === 'percent'"
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
            class="mt-3 p-2 rounded-md text-sm transition-colors flex justify-between"
            :class="totalValidation.class"
          >
            <span class="font-medium">{{ totalValidation.message }}</span>
            <span class="text-xs ml-2">
              Total:
              <template v-if="splitMethod === 'percent'"
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
        icon="i-heroicons-pencil"
        @click="handleSave"
        :loading="isSaving"
        class="mt-4 w-full flex items-center justify-center gap-2 rounded-full"
      >
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
import { v4 as uuid } from "uuid";

const supabase = useSupabaseClient();

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

const splitMethod = ref<"percent" | "amount">("percent");

// --- Lifecycle and Watchers ---

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      // Create deep copies to prevent reactivity issues.
      formState.value.title = JSON.parse(JSON.stringify(props.item.title));
      formState.value.cost = JSON.parse(JSON.stringify(props.item.cost));

      // Use assignments from props (now populated from page level)
      formState.value.assignments = JSON.parse(
        JSON.stringify(props.currentAssignments || [])
      );

      // Determine the split method from the first loaded assignment.
      const firstAssignmentMethod = props.currentAssignments?.[0]?.method;

      // The UI has two modes: 'percent' (for percentages) and 'amount' (for fixed currency).
      // The data can have 'equal' or 'percent', which both map to the UI's 'percent' mode.
      if (firstAssignmentMethod === "amount") {
        splitMethod.value = "amount";
      } else {
        // 'equal' or 'percent' methods are both handled as 'percent' in the UI.
        splitMethod.value = "percent";
        // When in percent mode, the 'value' field should represent the percentage for the UI.
        const cost = formState.value.cost;
        if (cost > 0) {
          formState.value.assignments.forEach((a) => {
            // The actual monetary value is now passed in props.currentAssignments.
            // We convert it to a percentage for the UI.
            const percentage = (a.value ?? 0) / cost;
            // Round to 4 decimal places for percentage precision
            a.value = Math.round(percentage * 10000) / 10000;
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
    // The method is determined by the current UI mode.
    method: splitMethod.value,
    value: 0,
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

function switchSplitMethod(method: "percent" | "amount", convertValues = true) {
  // If already on the same method, don't do anything
  if (splitMethod.value === method) {
    return;
  }

  const cost = formState.value.cost;
  if (convertValues && cost > 0) {
    formState.value.assignments.forEach((a) => {
      // When switching, convert the value to the new method's representation.
      if (method === "percent") {
        // From amount to percentage
        const percentage = (a.value ?? 0) / cost;
        // Round to 4 decimal places for percentage precision
        a.value = Math.round(percentage * 10000) / 10000;
        a.method = "percent";
      } else {
        // From percentage to amount
        const amount = (a.value ?? 0) * cost;
        // Round to 2 decimal places for currency precision
        a.value = Math.round(amount * 100) / 100;
        a.method = "amount";
      }
    });
  }
  splitMethod.value = method;
}

function splitEvenly() {
  const numAssignments = formState.value.assignments.length;
  if (numAssignments === 0) return;

  if (splitMethod.value === "percent") {
    // For percent mode, split the currency amount evenly first, then calculate percentages
    const distributedAmounts = distributeAmountEvenly(
      formState.value.cost,
      numAssignments
    );
    formState.value.assignments.forEach((assignment, index) => {
      const amount = distributedAmounts[index] || 0;
      // Calculate percentage from the distributed amount
      const percentage =
        formState.value.cost > 0 ? amount / formState.value.cost : 0;
      // Round to 4 decimal places for percentage precision
      assignment.value = Math.round(percentage * 10000) / 10000;
      assignment.method = "percent";
    });
  } else {
    const distributedAmounts = distributeAmountEvenly(
      formState.value.cost,
      numAssignments
    );
    formState.value.assignments.forEach((assignment, index) => {
      assignment.value = distributedAmounts[index] || 0;
      assignment.method = "amount";
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

  const limit = splitMethod.value === "percent" ? 1 : formState.value.cost;
  const maxNewValue = limit - otherAssignmentsSum;

  // Round to 2 decimal places to prevent floating point precision issues
  const finalValue = Math.min(value, maxNewValue < 0 ? 0 : maxNewValue);
  assignmentToUpdate.value = Math.round(finalValue * 100) / 100;
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

  if (splitMethod.value === "percent") {
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

  // Check if item ID exists and convert to string
  const itemId = props.item.id;
  if (!itemId) {
    toast.add({
      title: "Cannot Save",
      description: "Item ID is missing. Please try again.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
    return false;
  }

  const total = totalAmount.value;
  const cost = formState.value.cost;
  let isValid = true;
  let errorMessage = "";

  if (splitMethod.value === "percent" && Math.abs(total - 1) > 0.01) {
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

  isSaving.value = true;

  try {
    // Create a deep copy to work with, ensuring the drawer's state isn't mutated prematurely.
    const itemToSave = JSON.parse(JSON.stringify(formState.value));

    // The big simplification: The data is now stored in a consistent format that
    // mirrors the database schema. When the UI is in 'percent' (percentage) mode,
    // we just need to convert the percentage value back to a currency amount before saving.
    if (splitMethod.value === "percent") {
      itemToSave.assignments.forEach((a: ReceiptItemAssignmentForm) => {
        // The method is already 'percent', we just convert the UI value (percentage)
        // back to the final currency amount for storage.
        const calculatedAmount = (a.value ?? 0) * itemToSave.cost;
        // Round to 2 decimal places to prevent floating point precision issues
        a.value = Math.round(calculatedAmount * 100) / 100;
        // We could also set numerator/denominator here for the backend if needed.
      });
    }
    // No 'else' block needed. If the method is 'amount', the value is already a currency amount.

    // Save to local form state
    emit("save", props.fieldIndex, itemToSave);

    // Transform the form data to match the database schema and save to Supabase
    const assignmentsToSave = itemToSave.assignments.map(
      (assignment: ReceiptItemAssignmentForm) => {
        let calculatedAmount: number;

        if (splitMethod.value === "percent") {
          // Convert percentage to calculated amount
          calculatedAmount =
            Math.round((assignment.value ?? 0) * itemToSave.cost * 100) / 100;
        } else {
          // Amount mode - value is already the calculated amount
          calculatedAmount = assignment.value ?? 0;
        }

        return {
          id: assignment.id, // Preserve the ID if it exists
          receipt_item_id: itemId.toString(), // Convert to string for UUID
          user_name: assignment.user_name,
          method: assignment.method,
          value: assignment.value,
          calculated_amount: calculatedAmount,
        };
      }
    );

    // Save to Supabase
    // Separate new assignments (without ID) from existing ones (with ID)
    const newAssignments = assignmentsToSave
      .filter((assignment) => !assignment.id)
      .map((assignment) => ({
        ...assignment,
        id: uuid(), // Generate a UUID for new assignments
      }));
    const existingAssignments = assignmentsToSave.filter(
      (assignment) => assignment.id
    );

    // Insert new assignments
    if (newAssignments.length > 0) {
      const { error: insertError } = await supabase
        .from("receipt_item_assignments")
        .insert(newAssignments);

      if (insertError) {
        throw insertError;
      }
    }

    // Update existing assignments using upsert with ID
    if (existingAssignments.length > 0) {
      const { error: upsertError } = await supabase
        .from("receipt_item_assignments")
        .upsert(existingAssignments, {
          onConflict: "id",
        });

      if (upsertError) {
        throw upsertError;
      }
    }

    toast.add({
      title: "Success",
      description: "Item saved to form and database",
      color: "green",
      icon: "i-heroicons-check-circle",
    });

    emit("close");
    return true;
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to save to database. Please try again.",
      color: "red",
      icon: "i-heroicons-x-circle",
    });
    return false;
  } finally {
    isSaving.value = false;
  }
};
</script>
