<template>
  <DataTable
    :class="['max-w-1/3 overflow-clip rounded-lg shadow-sm ring-1 ring-black ring-opacity-5']"
    :columns="isKit ? kitColumns : productColumns"
    :has-footer="false"
    :rows="getReplenishmentComponentsBySku(productSku)"
    label="Components"
    row-key="component"
  >
    <!-- Component ID Column Cell -->
    <template #[`body-cell-id`]="{ row, column }">
      {{ useFormatter.number(get(row, column.field)) }}
    </template>
    <!-- Component Column Cell -->
    <template #[`body-cell-component`]="{ row, column }">
      <span
        :class="[
          'flex flex-col gap-2',
          { 'items-start': column.align === 'left' },
          { 'items-end': column.align === 'right' },
          { 'items-center': column.align === 'center' },
        ]"
      >
        <div :key="`${product.id}${product.sku}`" v-for="product in row.products">{{ product.sku }}</div>
      </span>
    </template>
    <!-- Component Required Quantity Column Cell -->
    <template #[`body-cell-required`]="{ row, column }">
      {{ useFormatter.number(get(row, column.field)) }}
    </template>
    <!-- Component Incoming Quantity Column Cell -->
    <template #[`body-cell-incoming`]="{ row, column }">
      <span
        :class="[
          'flex flex-col gap-2',
          { 'items-start': column.align === 'left' },
          { 'items-end': column.align === 'right' },
          { 'items-center': column.align === 'center' },
        ]"
      >
        <div :key="`${product.id}${product.sku}`" v-for="product in row.products">
          {{ useFormatter.number(product.incoming) }}
        </div>
      </span>
    </template>
    <!-- Component Allocatable Quantity Column Cell -->
    <template #[`body-cell-allocatable`]="{ row, column }">
      <span
        :class="[
          'flex flex-col gap-2',
          { 'items-start': column.align === 'left' },
          { 'items-end': column.align === 'right' },
          { 'items-center': column.align === 'center' },
        ]"
      >
        <div :key="`${product.id}${product.sku}`" v-for="product in row.products">
          <span
            :class="[
              'mr-2 inline-flex items-center rounded-full py-0.5 transition-all',
              { 'bg-rose-50 px-2.5 text-rose-500': product.allocatable <= 0 },
            ]"
          >
            {{ useFormatter.number(product.allocatable) }}
          </span>
        </div>
      </span>
    </template>
  </DataTable>
</template>

<script setup>
import { DataTable } from '@/components'
import { useFormatter } from '@/composables'
import { useReplenishmentStore } from '@/stores'
import { get } from 'lodash'

const { getReplenishmentComponentsBySku } = useReplenishmentStore()

defineProps({
  isKit: {
    required: true,
    type: Boolean,
  },
  productSku: {
    required: true,
    type: String,
  },
})

const productColumns = [
  { align: 'right', field: 'totalAllocatable', label: 'Allocatable', name: 'allocatable' },
  { align: 'right', field: 'totalIncoming', label: 'Incoming', name: 'incoming' },
]

const kitColumns = [
  { align: 'center', field: 'id', label: 'ID', name: 'id', sortable: true },
  { align: 'left', field: 'sku', label: 'Component', name: 'component', sortable: true },
  { align: 'right', field: 'required', label: 'Required', name: 'required', sortable: true },
  { align: 'right', field: 'totalAllocatable', label: 'Allocatable', name: 'allocatable', sortable: true },
  { align: 'right', field: 'totalIncoming', label: 'Incoming', name: 'incoming', sortable: true },
]
</script>
