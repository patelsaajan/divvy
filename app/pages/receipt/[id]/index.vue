<template>

  <template v-if="receiptStatus === 'success' && itemsStatus === 'success'">
  <div class="container mx-auto mt-6">
    <div class="flex items-center mb-6">
      <UButton variant="ghost" class="p-2 mr-2" @click="navigateTo('/')">
        <UIcon name="i-heroicons-chevron-left" :size="24" />
        <span class="ml-2">Expense Report</span>
      </UButton>
    </div>
    
    <div class="bg-gray-800 rounded-lg p-4 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h2>{{ receipt.title ?? 'Unknown' }}</h2>
        </div>
      </div>
    </div>
    
    <!-- Receipt Items -->
    <div class="mb-6">
      <h3 class="font-medium mb-3">Receipt</h3>
      <div class="bg-gray-800 rounded-lg p-4 mb-4">
        <!-- Receipt Header -->
        <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
          <div class="flex items-center">
            <div>
              <h4 class="font-medium">{{ receipt.vendor ?? 'Unknown' }}</h4>
              <span class="text-xs text-gray-400">{{ formatDate(receipt.uploaded_at) ?? 'Unknown' }}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="font-semibold text-lg">${{ receipt.total_cost ? receipt.total_cost.toFixed(2) : 0 }}</span>
            <div class="text-xs text-gray-400">{{ receiptItems.length }} items</div>
          </div>
        </div>

        <!-- Receipt Line Items -->
        <div class="space-y-2">
          <div 
            v-for="item in receiptItems" 
            :key="item.id" 
            class="flex justify-between items-center py-2"
          >
            <div class="font-medium">{{ item.title }}</div> 
          <div class="font-medium">${{ item.cost ? item.cost.toFixed(2) : 0 }}</div>
          </div>
        </div>

        <!-- Receipt Actions -->
        <div class="flex space-x-2 mt-3 pt-3 border-t border-gray-700">
          <NuxtLink to="/receipt/1/people" class="flex-1 bg-gray-700 text-white py-2 rounded text-sm flex items-center justify-center">
            <UIcon name="i-heroicons-user-group" :size="16" class="inline mr-1" />
            <span class="ml-2">People</span>
          </NuxtLink>
          <NuxtLink to="/receipt/1/edit" class="flex-1 bg-orange-500 text-white py-2 rounded text-sm flex items-center justify-center">
            <UIcon name="i-heroicons-pencil" :size="16" class="inline mr-1" />
            <span class="ml-2">Edit</span>
          </NuxtLink>
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
// Get the route parameter
const route = useRoute()
const id    = route.params.id

const client = useSupabaseClient()


const { data: receiptItems, status: itemsStatus } = useAsyncData('receipt_items', async () => {
  const { data, error } = await client.from('receipt_items').select('*').eq('receipt_id', id)
  return data ?? []
})

const { data: receipt, status: receiptStatus } = useAsyncData('receipt', async () => {
  const { data, error } = await client.from('receipts').select('*').eq('id', id).single()
  return data ?? []
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
</script> 