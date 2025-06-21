<template>

<template v-if="receiptsStatus === 'success'">
  <div class="px-4 py-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-semibold text-lg">Expenses</h1>        
      <NuxtLink :to="paths.upload" class="p-2">
        <UIcon name="i-lucide-plus" :size="20" />
      </NuxtLink>
    </div>

    
    <div class="text-xs text-gray-400 mb-4">FRIDAY 15 SEP</div>
    
    <div class="space-y-3">
      <div 
        v-for="receipt in receiptData" 
        :key="receipt.id" 
        class="bg-gray-800 rounded-lg p-4"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div class="p-2 rounded-md mr-3 bg-violet-500">
              <span class="text-white text-lg">🍑</span>
            </div>
            <div>
              <h3 class="font-medium">{{ receipt.vendor ?? 'Unknown' }}</h3>
              <span class="text-xs text-gray-400">{{ receipt.uploaded_at }}</span>
            </div>
          </div>
          <div class="flex items-center">
            <span class="font-semibold mr-2">
              ${{ receipt.total_cost.toFixed(2) }}
            </span>
            <NuxtLink :to="`/receipt/${receipt.id}/`" class="text-orange-500">
              <UIcon name="i-lucide-external-link" :size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<template v-else>
  Loading...
</template>

</template>


<script setup>
const client = useSupabaseClient()
import { paths } from '~~/utils/paths'
const { data: receiptData, status: receiptsStatus } = useAsyncData('receipt_items', async () => {
  const { data, error } = await client.from('receipts').select('*')
  return data ?? []
})

</script> 