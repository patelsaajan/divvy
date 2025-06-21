<template>

  <template v-if="receiptStatus === 'success' && itemsStatus === 'success'">
  <div class="container mx-auto mt-6">
    <div class="flex items-center mb-6">
      <UButton variant="link" color="secondary" class="p-2 mr-2 cursor-pointer" @click="navigateTo('/')">
        <UIcon name="i-heroicons-chevron-left" :size="24" />
        <span class="ml-2">Receipts</span>
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
      <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
        <h3 class="font-medium mb-3">Receipt</h3>

        <div class="flex items-center">
          <UAvatarGroup class="mr-4">
            <UAvatar v-for="member in members" v-show="member.checked" :key="member.name" :alt="member.name" />
          </UAvatarGroup>
          <UDropdownMenu :items="memberItems" :content="{ align: 'start' }" :ui="{ content: 'w-48' }">
            <UButton label="Members" color="primary" variant="outline" icon="i-lucide-users" />
          </UDropdownMenu>
      </div>
      </div>
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
            <div class="text-xs text-gray-400">{{ fields?.length ?? 0 }} items</div>
          </div>
        </div>

        <!-- Receipt Line Items -->
        <div class="space-y-2">
          <div 
            v-for="(field, idx) in fields" 
            :name="`items.${idx}.title`"
            :key="field.key"
            class="flex justify-between items-center py-2"
          >
            <div class="font-medium">{{ field.value.title }}</div> 
              <div class="flex items-center">
                <div class="font-medium">${{ field.value.cost ? field.value.cost.toFixed(2) : 0 }}</div>
                <UButton variant="ghost" icon="i-lucide-trash" @click="remove(idx)" class="ml-2 cursor-pointer hover:text-red-500" />
              </div>
          </div>
        </div>

        <!-- Calculate total cost as a sanity check -->
        <div class="border-t border-b border-gray-700 py-6">
          <div class="flex items-center justify-between">
            <div class="font-medium text-gray-300">Total</div>
            <div class="flex items-center">
              <div class="font-medium">${{ totalCost }}</div>
              <UIcon 
                :name="totalCost === receipt.total_cost ? 'i-lucide-check-circle' : 'i-lucide-x-circle'" 
                class="ml-2"
                :class="totalCost === receipt.total_cost ? 'text-green-500' : 'text-red-500'" 
              />
            </div>
          </div>
        </div>

        <!-- Receipt Actions -->
        <div class="flex space-x-2 mt-3 pt-3 ">
          <NuxtLink to="/receipt/1/people" class="flex-1 bg-gray-700 text-white py-2 rounded text-sm flex items-center justify-center">
            <UIcon name="i-heroicons-user-group" :size="16" class="inline mr-1" />
            <span class="ml-2">People</span>
          </NuxtLink>
          <UButton class="flex-1 bg-orange-500 text-white py-2 rounded text-sm flex items-center justify-center" @click="push({title: 'New Item', cost: 0 })">
            <UIcon name="lucide:plus" :size="16" class="inline mr-1" />Add Item
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

  <template v-else>
    <Loading />
  </template> 
</template>

<script setup lang="ts">
import type { ReceiptEditForm, ReceiptItemForm } from '~/types/receipts'
import { useForm, useFieldArray } from 'vee-validate'

// Get the route parameter
const route = useRoute()
const id    = route.params.id

const client = useSupabaseClient()

const members = ref([{name: 'John Doe', checked: true}, {name: 'Jane Doe', checked: false}])

const { data: receiptItems, status: itemsStatus } = useAsyncData('receipt_items', async () => {
  const { data, error } = await client.from('receipt_items').select('*').eq('receipt_id', id)
  return data ?? []
})

const { data: receipt, status: receiptStatus } = useAsyncData('receipt', async () => {
  const { data, error } = await client.from('receipts').select('*').eq('id', id).single()
  return data ?? []
})

const { handleSubmit, resetForm, values, setFieldValue } = useForm<ReceiptEditForm>({ initialValues: { items: null }})

const { remove, push, fields } = useFieldArray<ReceiptItemForm>('items')

const totalCost = computed(() => {
  return fields.value.reduce((acc, field) => acc + field.value.cost, 0).toFixed(2)
})

// Reset form when receipt items are successfully loaded
watch([itemsStatus, receiptItems], () => {
  if (itemsStatus.value === 'success' && receiptItems.value && !values.items) {
    resetForm({ values: { items: receiptItems.value } })
  }
}, { immediate: true })

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const createMemberItems = () => {
  const items = [
    {
      label: 'Members',
      icon: 'i-lucide-users',
      type: 'label'
    }
  ]
  
  if (members.value.length > 0) {
    items.push({ type: 'separator' })
  }
  
  items.push(...members.value.map((member) => ({
    label: member.name,
    type: 'checkbox',
    avatar: {
      alt: member.name,
    },
    checked: member.checked,
    onUpdateChecked(checked) {
      member.checked = checked
    }
  })))
  
  if (members.value.length > 0) {
    items.push({ type: 'separator' })
  }
  
  items.push({
    label: 'Add Member',
    icon: 'i-lucide-user-plus',
    type: 'link',
    to: '/receipt/1/people'
  })
  
  return items
}

const memberItems = computed(createMemberItems)
</script> 