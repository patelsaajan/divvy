<template>
  <div class="container mx-auto max-w-screen-md">
    <PageBackButton content="Back" :link="paths.home" />
    <PageHeader title="Summary" />

    <UTable
      v-model:expanded="expanded"
      :data="tableData"
      :columns="columns"
      :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
      class="flex-1"
    >
      <template #expanded="{ row }">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="space-y-2">
            <div
              v-for="(assignment, assignmentIndex) in getRowItems(row)"
              :key="assignmentIndex"
              class="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-700 rounded border"
            >
              <span class="font-medium text-gray-900 dark:text-gray-100">{{
                assignment.title
              }}</span>
              <span class="text-gray-600 dark:text-gray-400">
                {{
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "GBP",
                  }).format(assignment.calculated_amount)
                }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { UAvatar, UButton, UTable } from "#components";
import type { TableColumn } from "@nuxt/ui";
import { paths } from "~~/utils/paths";

definePageMeta({ layout: false });

const expanded = ref({ null: true });

const { membersTotals, membersTotalsError } = useMembersTotals(useRoute().params.id as string);

// Convert members totals data to table format
const tableData = computed(() => {
  if (!membersTotals.value) return [];

  return membersTotals.value.map((member, index) => {
    // Handle case where assignments might be undefined
    const assignments = member.assignments || [];

    // Calculate total from assignments
    const total = assignments.reduce((sum, assignment) => sum + assignment.calculated_amount, 0);

    return {
      name: member.user_name,
      total: total,
      items: assignments.map(assignment => ({
        title: assignment.title,
        calculated_amount: assignment.calculated_amount
      }))
    };
  });
});

// Helper function to get items from a table row
const getRowItems = (row: any) => {
  return (row.getValue('items') as { title: string; calculated_amount: number }[]) || [];
};

type TableRow = {
  name: string;
  total: number;
  items: { title: string; calculated_amount: number; }[];
};

const columns: TableColumn<TableRow>[] = [
  {
    id: "avatar",
    cell: ({ row }) =>
      h(UAvatar, {
        size: "md",
        alt: row.getValue("name") as string,
        class: "bg-blue-500/30",
      }),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => (row.getValue('items') as { title: string; calculated_amount: number; }[]).length
  },
  {
    accessorKey: "total",
    header: () => h("div", { class: "text-right" }, "Total"),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GBP",
      }).format(amount);

      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
]
</script>
