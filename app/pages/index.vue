<template>
  <template v-if="!receiptsLoading">
    <PageHeader title="Your Receipts">
      <template #action>
        <UButton :to="paths.upload" variant="ghost">
          <UIcon name="i-lucide-plus" :size="20" />
        </UButton>
      </template>
    </PageHeader>

    <div class="px-4">
      <div class="space-y-3">
        <div
          v-for="receipt in receipts"
          :key="receipt.id"
          class="bg-gray-800 rounded-lg p-4"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <div class="p-2 rounded-md mr-3 bg-violet-500">
                <span class="text-white text-lg">🍑</span>
              </div>
              <div>
                <h3 class="font-medium">{{ receipt.vendor ?? "Unknown" }}</h3>
                <span class="text-xs text-gray-400">{{
                  formatDate(receipt.uploaded_at)
                }}</span>
              </div>
            </div>
            <div class="flex items-center">
              <span class="font-semibold mr-2">
                {{
                  formatCurrency(
                    receipt.total_cost || 0,
                    receipt.currency,
                    receipt.locale
                  )
                }}
              </span>
              <UTooltip text="View Receipt">
                <UButton
                  :to="`/receipt/${receipt.id}/`"
                  variant="ghost"
                  class="p-2"
                >
                  <UIcon name="i-lucide-edit" size="20" />
                  <span class="sr-only">View Receipt</span>
                </UButton>
              </UTooltip>

              <UTooltip text="View Summary">
                <UButton
                  :to="`/summary/${receipt.id}/`"
                  variant="ghost"
                  class="p-2"
                >
                  <UIcon name="i-lucide-chart-bar" size="20" />
                  <span class="sr-only">View Summary</span>
                </UButton>
              </UTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <template v-else>
    <Loading />
  </template>
</template>

<script setup>
import { formatCurrency } from "~~/utils/currency";
import { formatDate } from "~~/utils/formatDate";
import { paths } from "~~/utils/paths";

const { receipts, receiptsLoading } = useReceipts();
</script>
