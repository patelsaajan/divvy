<template>
  <template v-if="!loading">
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="font-semibold text-lg">Receipts</h1>
        <NuxtLink :to="paths.upload" class="p-2">
          <UIcon name="i-lucide-plus" :size="20" />
        </NuxtLink>
      </div>

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
              <NuxtLink :to="`/receipt/${receipt.id}/`" class="h-5">
                <UIcon
                  name="i-lucide-external-link"
                  size="20"
                  class="text-white hover:text-secondary ml-4"
                />
              </NuxtLink>
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

const { receipts, loading, error, refresh } = useReceipts();
</script>
