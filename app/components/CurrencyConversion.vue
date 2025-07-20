<template>
  <UDropdownMenu
    :items="items"
    :content="{
      align: 'start',
      side: 'bottom',
      sideOffset: 8,
    }"
    class="cursor-pointer mt-4"
    :ui="{
      content: 'w-fit',
    }"
  >
    <UButton
      :label="currentCurrency.label"
      :icon="currentCurrency.icon"
      color="primary"
      variant="outline"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuProps } from '@nuxt/ui'

interface CurrencyItem {
  label: string
  icon: string
}

const props = defineProps<{
  currency: string
}>()

const currentCurrency = reactive({
    value: props.currency,
    icon: 'i-lucide-pound-sterling',
    label: 'GBP'
})

const emit = defineEmits<{
  (e: 'update:currency', currency: string): void
}>()

const updateCurrency = (currency: string) => {
    const selectedItem = currencyItems.find(item => item.label === currency)
    if (selectedItem) {
        currentCurrency.icon  = selectedItem.icon
        currentCurrency.label = selectedItem.label
        emit('update:currency', selectedItem.label)
    }
}

const currencyItems: CurrencyItem[] = [
  {
    label: 'GBP',
    icon: 'i-lucide-pound-sterling'
  },
  {
    label: 'USD',
    icon: 'i-lucide-dollar-sign'
  },
  {
    label: 'EUR',
    icon: 'i-lucide-euro'
  }
]

const items = computed<DropdownMenuProps['items']>(() => [
  {
    label: 'GBP',
    icon: 'i-lucide-pound-sterling',
    onSelect: () => updateCurrency('GBP'),
    class: 'cursor-pointer hover:bg-gray-700',
    color: currentCurrency.label === 'GBP' ? 'info' : 'neutral'
  },
  {
    label: 'USD',
    icon: 'i-lucide-dollar-sign',
    onSelect: () => updateCurrency('USD'),
    class: 'cursor-pointer hover:bg-gray-700',
    color: currentCurrency.label === 'USD' ? 'info' : 'neutral'
  },
  {
    label: 'EUR',
    icon: 'i-lucide-euro',
    onSelect: () => updateCurrency('EUR'),
    class: 'cursor-pointer hover:bg-gray-700',
    color: currentCurrency.label === 'EUR' ? 'info' : 'neutral'
  }
])
</script>
