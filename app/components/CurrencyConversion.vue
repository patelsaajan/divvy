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
  value: string
}

const currentCurrency = reactive({
    value: 'gbp',
    icon: 'i-lucide-pound-sterling',
    label: 'GBP'
})

const updateCurrency = (currency: string) => {
    const selectedItem = currencyItems.find(item => item.value === currency)
    if (selectedItem) {
        currentCurrency.value = selectedItem.value
        currentCurrency.icon  = selectedItem.icon
        currentCurrency.label = selectedItem.label
    }
}

const currencyItems: CurrencyItem[] = [
  {
    label: 'GBP',
    icon: 'i-lucide-pound-sterling',
    value: 'gbp'
  },
  {
    label: 'USD',
    icon: 'i-lucide-dollar-sign',
    value: 'usd'
  },
  {
    label: 'EUR',
    icon: 'i-lucide-euro',
    value: 'eur'
  }
]

const items = computed<DropdownMenuProps['items']>(() => [
  {
    label: 'GBP',
    icon: 'i-lucide-pound-sterling',
    value: 'gbp',
    onSelect: () => updateCurrency('gbp'),
    class: 'cursor-pointer hover:bg-gray-700',
    color: currentCurrency.value === 'gbp' ? 'info' : 'neutral'
  },
  {
    label: 'USD',
    icon: 'i-lucide-dollar-sign',
    value: 'usd',
    onSelect: () => updateCurrency('usd'),
    class: 'cursor-pointer hover:bg-gray-700',
    color: currentCurrency.value === 'usd' ? 'info' : 'neutral'
  },
  {
    label: 'EUR',
    icon: 'i-lucide-euro',
    value: 'eur',
    onSelect: () => updateCurrency('eur'),
    class: 'cursor-pointer hover:bg-gray-700',
    color: currentCurrency.value === 'eur' ? 'info' : 'neutral'
  }
])
</script>
