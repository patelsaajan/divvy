<template>
  <template v-if="!receiptsLoading">
    <PageHeader title="Your Receipts">
      <template #action>
        <UDropdownMenu :items="menuItems" :content="{ align: 'start' }">
          <UButton variant="ghost" icon="i-lucide-plus" />
        </UDropdownMenu>
      </template>
    </PageHeader>

    <div class="px-4">
      <div class="space-y-3">
        <div
          v-for="receipt in receipts"
          :key="receipt.id"
          :class="
            `
            flex justify-between bg-gray-800 rounded-lg p-4 overflow-x-hidden
            ${isMobile ? 'flex-col' : 'flex-row items-center'}
          `
          "
        >
          <!-- Receipt header -->
          <div class="flex items-center">
            <div class="p-2 rounded-md mr-3 bg-violet-500">
              <span class="text-white text-lg">🍑</span>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-ellipsis">
                {{ receipt.vendor ?? "Unknown" }}
              </h3>
              <div
                :class="
                  `flex justify-between ${isMobile ? 'flex-row' : 'flex-col'}`
                "
              >
                <span class="text-xs text-gray-400">
                  {{ formatDate(receipt.uploaded_at) }}
                </span>

                <span v-show="isMobile" class="text-xs text-gray-400">
                  {{
                    formatCurrency(
                      receipt.total_cost || 0,
                      receipt.currency,
                      receipt.locale
                    )
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Cost and actions -->
          <div v-show="!isMobile" class="flex items-center justify-end">
            <span class="font-semibold mr-2">
              {{
                formatCurrency(
                  receipt.total_cost || 0,
                  receipt.currency,
                  receipt.locale
                )
              }}
            </span>

            <UTooltip text="Edit Receipt">
              <UButton
                :to="paths.receipt(receipt.id)"
                variant="ghost"
                class="p-2"
              >
                <UIcon name="i-lucide-edit" size="20" />
                <span class="sr-only">Edit Receipt</span>
              </UButton>
            </UTooltip>

            <UTooltip text="View Summary">
              <UButton
                :to="paths.summary(receipt.id)"
                variant="ghost"
                class="p-2"
              >
                <UIcon name="i-lucide-chart-bar" size="20" />
                <span class="sr-only">View Summary</span>
              </UButton>
            </UTooltip>
          </div>

          <div v-show="isMobile" class="flex gap-2 mt-4">
            <UButton
              variant="soft"
              icon="i-lucide-edit"
              :to="paths.receipt(receipt.id)"
              class="flex-1 flex items-center justify-center text-white rounded"
              >Edit</UButton
            >
            <UButton
              variant="outline"
              icon="i-lucide-chart-bar"
              :to="paths.summary(receipt.id)"
              class="flex-1 flex items-center justify-center text-white rounded"
              >Summary</UButton
            >
          </div>
        </div>
      </div>
    </div>

    <DrawerEditReceipt :open="drawerOpen" @close="drawerOpen = false" />
  </template>

  <template v-else>
    <Loading />
  </template>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { formatCurrency } from "~~/utils/currency";
import { formatDate } from "~~/utils/formatDate";
import { paths } from "~~/utils/paths";

const { isMobile } = useDevice();

const { receipts, receiptsLoading } = useReceipts();

const drawerOpen = ref(false);

const menuItems: DropdownMenuItem[] = [
  {
    label: "Create new receipt",
    icon: "i-lucide-plus",
    onClick: () => (drawerOpen.value = true),
  },
  {
    label: "Upload existing receipt",
    icon: "i-heroicons-camera",
    onClick: () => navigateTo(paths.upload),
  },
];
</script>
