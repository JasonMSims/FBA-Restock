<template>
  <tr :class="['group/row relative transition hover:bg-slate-50']">
    <td
      :class="[
        'sticky left-0 z-30 w-12 border-b border-slate-200  px-6 transition group-last-of-type/row:border-b-0 sm:w-16 sm:px-8',
        selectedProducts.includes(product.sku) ? 'bg-slate-50 group-hover/row:bg-slate-50' : 'bg-white group-hover/row:bg-slate-50',
      ]"
    >
      <div class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" v-if="selectedProducts.includes(product.sku)"></div>
      <Checkbox :value="product.sku" v-model="selectedProducts" />
    </td>
    <td
      :class="[
        'sticky left-16 z-20 whitespace-nowrap border-b border-l-0 border-slate-200  py-4 pr-3 transition-all group-last-of-type/row:border-b-0',
        selectedProducts.includes(product.sku) ? 'bg-slate-50 group-hover/row:bg-slate-50' : 'bg-white group-hover/row:bg-slate-50',
        tableScrolled ? 'border-r-4 drop-shadow-xl' : 'border-r-0 drop-shadow-none',
      ]"
    >
      <div class="flex items-center">
        <!-- <div class="h-10 w-10 flex-shrink-0">
          <img :src="product.amazon.asin" alt class="h-10 w-10 rounded-full" />
        </div> -->
        <div class="ml-4">
          <div :class="['text-sm font-medium', selectedProducts.includes(product.sku) ? 'text-indigo-600' : 'text-slate-900']">
            {{ product.sku }}
          </div>
          <AsinTag :asin="product.amazon.asin" v-if="product.amazon.asin" />
        </div>
      </div>
    </td>
    <td
      :class="[
        'whitespace-nowrap border-b border-slate-200 px-3 py-4 text-sm text-slate-500 group-last-of-type/row:border-b-0',
        { 'bg-slate-50': selectedProducts.includes(product.sku) },
      ]"
    >
      {{ useFormatter.currency(product.amazon.price) }}
    </td>
    <td
      :class="[
        'whitespace-nowrap border-b border-slate-200 px-3 py-4 text-right text-sm text-slate-500 group-last-of-type/row:border-b-0',
        { 'bg-slate-50': selectedProducts.includes(product.sku) },
      ]"
    >
      {{ useFormatter.number(product.unitsSold['30d']) }}
    </td>
    <td
      :class="[
        'whitespace-nowrap border-b border-slate-200 px-3 py-4 text-right text-sm text-slate-500 group-last-of-type/row:border-b-0',
        { 'bg-slate-50': selectedProducts.includes(product.sku) },
      ]"
    >
      {{ useFormatter.number(product.unitsSold['7d']) }}
    </td>
    <td
      :class="[
        'whitespace-nowrap border-b border-slate-200 px-3 py-4 text-right text-sm text-slate-500 group-last-of-type/row:border-b-0',
        { 'bg-slate-50': selectedProducts.includes(product.sku) },
      ]"
      :key="statusIdx"
      v-for="(status, statusIdx) of displayedInventoryStatuses"
    >
      {{ useFormatter.number(product.amazon.inventory[status]) }}
    </td>
    <td
      :class="[
        'whitespace-nowrap border-b border-slate-200 px-3 py-4 text-right text-sm text-slate-500 group-last-of-type/row:border-b-0',
        { 'bg-slate-50': selectedProducts.includes(product.sku) },
      ]"
    >
      {{ useFormatter.number(product.amazon.inventory.sellable) }}
    </td>
    <td
      :class="[
        ' whitespace-nowrap border-b border-gray-200 px-3 py-4 text-right text-sm text-gray-500 group-last-of-type/row:border-b-0',
        { 'bg-gray-50': selectedProducts.includes(product.sku) },
      ]"
    >
      <span class="inline-flex items-center">
        <span
          :class="[
            'inline-flex items-center rounded-full py-0.5 transition-all',
            {
              'bg-red-100 px-2.5 text-red-600': allocatableQuantity <= 0,
            },
          ]"
          >{{ useFormatter.number(allocatableQuantity) }}
        </span>
        <span v-if="isKit">
          <CubeTransparentIcon :class="['ml-2 h-4 w-4 text-slate-400']" />
        </span>
      </span>
    </td>
  </tr>
</template>
<script setup>
import { AsinTag, Checkbox, Tag, TagGroup } from '@/components/elements'
import { useFormatter } from '@/composables/useFormatter'
import { useProductStore, useReplenishmentStore } from '@/stores'
import { CubeTransparentIcon } from '@heroicons/vue/20/solid'
import { storeToRefs } from 'pinia'
import { computed, ref, toRefs } from 'vue'

const productStore = useProductStore()
const replenishmentStore = useReplenishmentStore()

const { kits, products } = storeToRefs(productStore)
const { replenishmentComponents } = storeToRefs(replenishmentStore)

const selectedProducts = defineModel('selectedProducts', { type: Array })
const props = defineProps({ product: Object, tableScrolled: Boolean })

const displayedInventoryStatuses = ['inbound', 'working', 'reserved', 'fulfillable']

const isKit = computed(() => kits.value[props.product.sku] !== undefined)

const kitComponents = computed(() => (isKit.value ? kits.value[props.product.sku].components : []))

const allocatableQuantity = computed(() => {
  return props.product.warehouse.inventory.allocatable
})

const getComponentQuantities = (componentProducts) => {
  return products.value.reduce(
    (quantities, product) => {
      if (componentProducts.includes(product.sku)) {
        quantities.available += product.warehouse.inventory.available - (replenishmentComponents?.[product.sku]?.allocated || 0)
        quantities.incoming += product.warehouse.inventory.incoming
      }
      return quantities
    },
    { available: 0, incoming: 0 }
  )
}
</script>
