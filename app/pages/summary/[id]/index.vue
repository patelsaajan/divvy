<template>
  <div class="container">
    <div class="flex items-center mb-6">
      <UButton
        variant="link"
        color="secondary"
        class="p-2 mr-2 cursor-pointer"
        @click="navigateTo(`/receipt/${id}`)"
      >
        <UIcon name="i-heroicons-chevron-left" :size="24" />
        <span class="ml-2">Back</span>
      </UButton>
    </div>
    <PageHeader title="Summary" />
    <UTable
      v-model:expanded="expanded"
      :data="dataTest"
      :columns="columns"
      :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
      class="flex-1"
    >
      <template #expanded="{ row }">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="space-y-2">
            <div
              v-for="(item, index) in (row.getValue('items') as Item[])"
              :key="index"
              class="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-700 rounded border"
            >
              <span class="font-medium text-gray-900 dark:text-gray-100">{{
                item.name
              }}</span>
              <span class="text-gray-600 dark:text-gray-400">
                {{
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "GBP",
                  }).format(item.price)
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
import { UTable, UButton, UAvatar } from '#components'
import type { TableColumn } from '@nuxt/ui'

const { id } = useRoute().params;
const expanded = ref({ null: true })

const { receiptItems, receiptItemsStatus, receiptItemsError } = useMembersTotals(id as string);

type Item = {
  name: string
  price: number
}

type Payment = {
  name : string
  items: Item[]
  total: number
  color: string
}

const columns: TableColumn<Payment>[] = [
  {
    id: 'avatar',
    cell: ({ row }) => h(UAvatar, {
      size: 'md',
      alt: row.getValue('name') as string,
      class: 'bg-blue-500/30'
    })
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => (row.getValue('items') as Item[]).length
  },
  {
    accessorKey: 'total',
    header: () => h('div', { class: 'text-right' }, 'Total'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('total'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  },
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
]


const dataTest = ref<Payment[]>([
  {
    name: 'James Anderson',
    total: 36.50,
    color: 'bg-red-500',
    items: [
      {
        name: 'Pizza',
        price: 10.00
      },
      {
        name: 'Pasta',
        price: 10.00
      }
    ]
  },
  {
    name: 'Mia White',
    items: [
      {
        name: 'Pizza',
        price: 10.00
      },
      {
        name: 'Chilli',
        price: 10.00
      }
    ],
    total: 10.00,
    color: 'bg-cyan-500'
  },
  {
    name: 'William Brown',
    items: [
      {
        name: 'Chopped Tomatoes',
        price: 10.00
      },
    ],
    total: 19.20,
    color: 'bg-blue-500'
  },
  {
    name: 'Emma Davis',
    items: [
      {
        name: 'Item 1',
        price: 10.00
      }
    ],
    total: 10.00,
    color: 'bg-emerald-500'
  },
  {
    name: 'Ethan Harris',
    items: [
      {
        name: 'Item 1',
        price: 10.00
      }
    ],
    total: 10.00,
    color: 'bg-amber-500'
  }
])
</script>
