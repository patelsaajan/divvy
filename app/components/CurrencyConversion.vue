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
  <DrawerCustomConversion
    :open="open"
    @close="open = false"
    @update:conversionRate="updateCurrency('MAN', $event)"
  />
</template>

<script setup lang="ts">
import type { DropdownMenuProps } from '@nuxt/ui'
import { currencies } from '../../dummyData/currencies'

interface CurrencyItem {
  label: string
  icon: string
  rate: number
}

const open = ref(false)

const props = defineProps<{
  currency: string
}>()

const currentCurrency = reactive({
    value: props.currency,
    icon: 'i-lucide-pound-sterling',
    label: 'GBP',
    rate: 1
})

const emit = defineEmits<{
  (e: 'update:currency', data: { currency: string; rate: number }): void
}>()

const updateCurrency = (currency: string, rate: number) => {
    const selectedItem = currencyItems.find(item => item.label === currency)
    if (selectedItem) {
        currentCurrency.icon  = selectedItem.icon
        currentCurrency.label = selectedItem.label

        if (selectedItem.label === 'MAN') {
            // If rate is provided (from custom conversion), use it and emit
            if (rate !== selectedItem.rate) {
                currentCurrency.rate = rate
                emit('update:currency', { currency: selectedItem.label, rate: rate })
            } else {
                // If no custom rate, open drawer for manual input
                currentCurrency.rate = 1
                open.value = true
            }
        } else {
            currentCurrency.rate = selectedItem.rate
            emit('update:currency', { currency: selectedItem.label, rate: selectedItem.rate })
        }
    }
}

const currencyItems: CurrencyItem[] = currencies.map((currency: { label: string; icon: string; rate: number }) => ({
  label: currency.label,
  icon: currency.icon,
  rate: currency.rate
}))

const items = computed<DropdownMenuProps['items']>(() =>
  currencyItems.map(currency => ({
    label: currency.label,
    icon: currency.icon,
    onSelect: () => updateCurrency(currency.label, currency.rate),
    class: 'cursor-pointer',
    color: currentCurrency.label === currency.label ? 'info' : 'neutral'
  }))
)
</script>
