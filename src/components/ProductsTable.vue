<template>
  <DataTable
    :class="['mx-4 my-4', 'rounded-lg', 'shadow-sm ring-1 ring-black ring-opacity-5 sm:mx-6 lg:mx-8']"
    :columns="productColumns"
    :rows="skuTableData"
    label="Products"
    row-key="sku"
    v-if="!skuTableDataLoading"
    v-model="selectedProducts"
  >
    <!-- SKU Column Cell -->
    <template #body-cell-sku="{ row }">
      <div class="ml-4">
        <div :class="['text-sm font-medium']">
          {{ row.sku }}
        </div>
        <AsinTag :asin="row.amazon.asin" v-if="row.amazon.asin" />
      </div>
    </template>
    <!-- Price Column Cell -->
    <template #body-cell-price="{ row }">
      {{ useFormatter.currency(row.amazon.price) }}
    </template>
    <!-- Looped Units Sold Column Cells -->
    <template #[`body-cell-unitsSold${day}`]="{ row, column }" v-for="day in ['30d', '7d']">
      {{ useFormatter.number(get(row, column.field)) }}
    </template>
    <!-- Looped Inventory Columns Headers -->
    <template #[`header-cell-${value}`]="{ column }" :key="invIdx" v-for="(value, key, invIdx) in inventoryColumns">
      <Checkbox :value="value" @click.stop class="mr-2" v-model="includedInventoryStatuses" />
      {{ column.label }}
    </template>
    <!-- Looped Inventory Columns Cells -->
    <template #[`body-cell-${value}`]="{ row, column }" :key="invIdx" v-for="(value, key, invIdx) in inventoryColumns">
      {{ useFormatter.number(get(row, column.field)) }}
    </template>
    <!-- Total Inventory Column Cell -->
    <template #body-cell-sellable="{ row, column }">
      {{ useFormatter.number(get(row, column.field)) }}
    </template>
    <!-- Total Inventory Column Cell -->
    <template #body-cell-allocatable="{ row }">
      <span
        :class="[
          'mr-2 inline-flex items-center rounded-full py-0.5 transition-all',
          { 'bg-rose-100/50 px-2.5 text-rose-500 dark:bg-rose-400/10 dark:text-rose-400': getAllocatableQuantity(row.sku) <= 0 },
        ]"
      >
        {{ useFormatter.number(getAllocatableQuantity(row.sku)) }}
      </span>
      <Popover :class="['overflow-hidden']" :flip="40" :offset="5" :z-index="30" mode="click" placement="bottom-end">
        <template #trigger>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50/50 transition-colors hover:bg-slate-100/50 dark:bg-slate-800/15 dark:hover:bg-slate-800/25"
          >
            <span>
              <component :class="['h-5 w-5 text-slate-400']" :is="isKit(row.sku) ? Boxes : Box" :stroke-width="1.25" />
            </span>
          </div>
        </template>
        <template #panel>
          <ComponentsTable :isKit="isKit(row.sku)" :productSku="row.sku" />
        </template>
      </Popover>
    </template>
    <!-- Run Rate Column Cell -->
    <template #body-cell-runRate="{ row }">
      <div class="flex justify-center gap-2">
        <TagGroup :key="idx" attached v-for="({ label, name }, idx) in mappedRunRate">
          <Tag :label="label" :type="runRate.duration === name ? 'is-data' : undefined" />
          <Tag :class="['w-14']" :label="useFormatter.decimal(row.runRate[name])" />
        </TagGroup>
      </div>
    </template>
    <!-- Days On-Hand Column Cell -->
    <template #body-cell-daysOnHand="{ row, column }">
      {{ useFormatter.number(get(row, column.field)) }}
    </template>
    <!-- Recommendation Column Cell -->
    <template #body-cell-recommendation="{ row }">
      <div class="flex justify-center gap-2">
        <TagGroup :key="idx" attached v-for="({ label, name }, idx) in mappedRunRate">
          <Tag :label="label" :type="runRate.duration === name ? 'is-data' : undefined" />
          <Tag :class="['w-14']" :label="useFormatter.number(row.recommendation[name])" />
        </TagGroup>
      </div>
    </template>
    <!-- On-Hand Alert Column Cell -->
    <template #body-cell-onHandAlert="{ row }">
      <Tag :label="row.onHandAlert.message" :outline="false" :type="row.onHandAlert.type" />
    </template>
    <!-- FBA Quantity Column Cell -->
    <template #body-cell-fbaQuantity="{ row }">
      <NumberInput
        :modelValue="useReplenishmentStore().getReplenishmentQuantity(row.sku)"
        @update:modelValue="setReplenishmentProduct({ productSku: row.sku, replenishmentQuantity: $event })"
      />
    </template>
    <!-- Quantity Per Case Column Cell -->
    <template #body-cell-quantityPerCase="{ row }">
      <NumberInput
        :modelValue="useReplenishmentStore().getQuantityPerCase(row.sku)"
        @update:modelValue="setReplenishmentProduct({ productSku: row.sku, quantityPerCase: $event })"
      />
    </template>
    <!-- Production Metrics Column Cell -->
    <template #body-cell-productionMetrics="{ row }">
      <div class="flex justify-center gap-2">
        <TagGroup attached v-if="hasMetrics(row)">
          <Tag label="Bundling Time" type="is-data" />
          <Tag :label="formatBundlingTime(row)" />
        </TagGroup>
      </div>
    </template>
  </DataTable>
</template>

<script setup>
import { AsinTag, Checkbox, ComponentsTable, DataTable, NumberInput, Popover, Tag, TagGroup } from '@/components'
import { useFormatter, useSkuTable } from '@/composables'
import { useProductStore, useReplenishmentStore, useSettingsStore, useUIStore } from '@/stores'
import humanizeDuration from 'humanize-duration'
// import { CubeIcon, CubeTransparentIcon } from '@heroicons/vue/24/outline'
import { get, orderBy } from 'lodash'
import { debounce } from 'lodash'
import { Box, Boxes } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { isKit } = useProductStore()
const { includedInventoryStatuses, inventoryColumns } = storeToRefs(useSettingsStore())
const { runRate } = storeToRefs(useUIStore())
const { skuTableDataLoading } = useSkuTable()
// const skuTableDataLoading = ref(false)
const { getAllocatableQuantity } = useReplenishmentStore()

const skuTableData = computed(() => {
  return orderBy(useSkuTable().skuTableData.value, 'sku', 'asc')
})

const { replenishmentProducts } = storeToRefs(useReplenishmentStore())
const selectedProducts = computed({
  get: () => [...replenishmentProducts.value.keys()],
  set(value) {
    const changedProducts = [
      ...value.filter((productSku) => !selectedProducts.value.includes(productSku)), // New products
      ...selectedProducts.value.filter((productSku) => !value.includes(productSku)), // Removed products
    ]

    changedProducts.forEach((productSku) => {
      useReplenishmentStore().setReplenishmentProduct({
        productSku,
        replenishmentQuantity: value.includes(productSku) ? 1 : 0, // Set quantity based on inclusion
      })
    })

    return value
  },
})

const mappedRunRate = [
  { label: '7 Day', name: '7d' },
  { label: '30 Day', name: '30d' },
]

const productColumns = [
  {
    align: 'left',
    field: 'sku',
    frozen: true,
    label: 'SKU',
    name: 'sku',
    sortable: true,
  },
  {
    align: 'right',
    field: 'amazon.price',
    label: 'Price',
    name: 'price',
    sortable: true,
  },
  {
    align: 'right',
    field: 'unitsSold.30d',
    label: 'Units Sold (30 Days)',
    name: 'unitsSold30d',
    sortable: true,
  },
  {
    align: 'right',
    field: 'unitsSold.7d',
    label: 'Units Sold (7 Days)',
    name: 'unitsSold7d',
    sortable: true,
  },
  {
    align: 'right',
    field: 'amazon.inventory.inbound',
    // frozen: true,
    label: 'Inbound Inventory',
    name: 'inbound',
    sortable: true,
  },
  {
    align: 'right',
    field: 'amazon.inventory.working',
    label: 'Working Inventory',
    name: 'working',
    sortable: true,
  },
  {
    align: 'right',
    field: 'amazon.inventory.reserved',
    label: 'Transfer Inventory',
    name: 'reserved',
    sortable: true,
  },
  {
    align: 'right',
    field: 'amazon.inventory.fulfillable',
    label: 'Available Inventory',
    name: 'fulfillable',
    sortable: true,
  },
  {
    align: 'right',
    field: 'amazon.inventory.sellable',
    // frozen: true,
    label: 'Total Inventory',
    name: 'sellable',
    sortable: true,
  },
  {
    align: 'right',
    field: 'warehouse.inventory.allocatable',
    label: 'Allocatable Inventory',
    name: 'allocatable',
  },
  {
    align: 'center',
    field: 'runRate.active',
    label: 'Run Rate',
    name: 'runRate',
    sortable: true,
  },
  {
    align: 'right',
    field: 'daysOnHand',
    label: 'Days On-Hand',
    name: 'daysOnHand',
    sortable: true,
  },
  {
    align: 'center',
    field: 'recommendation',
    label: 'Recommendation',
    name: 'recommendation',
    sortable: true,
  },
  {
    align: 'center',
    field: 'onHandAlert.message',
    label: 'On-Hand Alert',
    name: 'onHandAlert',
    sortable: true,
  },
  {
    align: 'center',
    field: 'fbaQuantity',
    label: 'FBA Quantity',
    name: 'fbaQuantity',
    sortable: false,
  },
  {
    align: 'center',
    field: 'quantityPerCase',
    label: 'Quantity Per Case',
    name: 'quantityPerCase',
    sortable: false,
  },
  {
    align: 'center',
    field: 'productionMetrics',
    label: 'Production Metrics',
    name: 'productionMetrics',
    sortable: false,
  },
]

const setReplenishmentProduct = debounce((updateData) => {
  const { productSku, ...dataToUpdate } = updateData
  useReplenishmentStore().setReplenishmentProduct({
    productSku,
    ...dataToUpdate,
  })
}, 500)

const hasMetrics = (product) => {
  return product?.bundling?.average && !Number.isNaN(parseFloat(product?.bundling?.average))
}

const formatBundlingTime = (product) => {
  if (hasMetrics(product)) {
    const replenishmentQuantity = useReplenishmentStore().getReplenishmentQuantity(product.sku)
    const timeInSeconds = (replenishmentQuantity / product?.bundling?.average) * 3600
    return humanizeDuration(timeInSeconds * 1000, {
      round: true,
      units: ['h', 'm'],
    })
  }
}
</script>
