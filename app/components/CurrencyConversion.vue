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
import { currencies } from '../../dummyData/currencies'

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

const currencyItems: CurrencyItem[] = currencies.map((currency: { label: string; icon: string }) => ({
  label: currency.label,
  icon: currency.icon
}))

const items = computed<DropdownMenuProps['items']>(() =>
  currencyItems.map(currency => ({
    label: currency.label,
    icon: currency.icon,
    onSelect: () => updateCurrency(currency.label),
    class: 'cursor-pointer',
    color: currentCurrency.label === currency.label ? 'info' : 'neutral'
  }))
)
</script>
