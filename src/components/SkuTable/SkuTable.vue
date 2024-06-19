<template>
  <b-table
    :checked-rows="checkedRows"
    :data="skuTableData"
    :loading="tableLoading"
    :per-page="tablePagination.perPage"
    @check="onRowChecked"
    @check-all="onAllRowsChecked"
    checkable
    checkbox-position="left"
    class=""
    custom-row-key="sku"
    default-sort="sku"
    hoverable
    paginated
    pagination-position="top"
    pagination-simple
    scrollable
    sort-icon="arrow-up"
    sticky-checkbox
    sticky-header
  >
    <b-table-column cell-class="relative" field="sku" label="SKU" sortable sticky v-slot="props">
      <sku-column
        :asin="props.row.amazon.asin"
        :isSkuSelected="isSkuSelected(props.row.sku)"
        :marketplaceCode="marketplaceCode"
        :sku="props.row.sku"
      />
    </b-table-column>
    <b-table-column field="amazon.price" label="Price" numeric sortable v-slot="props">
      {{ useFormatter.currency(props.row.amazon.price) }}
    </b-table-column>
    <b-table-column field="unitsSold.30d" label="Units Sold (30 Days)" numeric sortable v-slot="props">
      {{ useFormatter.number(props.row.unitsSold['30d']) }}
    </b-table-column>
    <b-table-column field="unitsSold.7d" label="Units Sold (7 Days)" numeric sortable v-slot="props">
      {{ useFormatter.number(props.row.unitsSold['7d']) }}
    </b-table-column>
    <b-table-column :field="`amazon.inventory.${value}`" :key="value" numeric sortable v-for="(value, status) in inventoryColumns">
      <template v-slot:header="{ column }">
        <inventory-column
          :icon="column.$table.sortIcon"
          :iconPack="column.$table.iconPack"
          :iconSize="column.$table.sortIconSize"
          :isAsc="column.$table.isAsc"
          :isCurrentSortColumn="column.$table.currentSortColumn === column"
          :status="status"
          :value="value"
        />
      </template>
      <template v-slot="props"> {{ useFormatter.number(props.row.amazon.inventory[value]) }} </template>
    </b-table-column>
    <b-table-column field="amazon.inventory.sellable" label="Total Inventory" numeric sortable v-slot="props">
      {{ useFormatter.number(props.row.amazon.inventory.sellable) }}
    </b-table-column>
    <b-table-column field="warehouse.inventory.allocatable" label="Allocatable Inventory" numeric sortable v-slot="props">
      <allocatable-column :product="props.row" />
    </b-table-column>
    <b-table-column centered field="runRate.active" label="Run Rate" numeric sortable v-slot="props">
      <run-rate-column :runRateDuration="runRate.duration" :unitsSold7d="props.row.unitsSold['7d']" :unitsSold30d="props.row.unitsSold['30d']" />
    </b-table-column>
    <b-table-column field="daysOnHand" label="Days On-Hand" numeric sortable v-slot="props">
      {{ props.row.daysOnHand === Infinity ? '&infin;' : useFormatter.number(props.row.daysOnHand) }}
    </b-table-column>
    <b-table-column centered field="recommendation.active" label="Recommendation" numeric sortable v-slot="props">
      <recommendation-column
        :recommendation7d="props.row.recommendation['7d']"
        :recommendation30d="props.row.recommendation['30d']"
        :runRateDuration="runRate.duration"
      />
    </b-table-column>
    <b-table-column field="onHandAlert.message" label="On-Hand Alert" numeric sortable v-slot="props">
      <span :class="['tag', 'is-rounded', props.row.onHandAlert.type]" v-if="props.row.onHandAlert.message">{{ props.row.onHandAlert.message }}</span>
    </b-table-column>
    <b-table-column centered label="FBA Quantity" sortable v-slot="props">
      <fba-quantity-column :sku="props.row.sku" />
    </b-table-column>
    <b-table-column centered label="Quantity Per Case" sortable v-slot="props">
      <quantity-per-case-column :optimizedShipQty="props.row.optimizedShipQty" :sku="props.row.sku" />
    </b-table-column>
    <b-table-column label="Production Metrics" v-slot="props">
      <production-metrics-column :bundlingAverage="props.row?.bundling?.average" :sku="props.row.sku" />
    </b-table-column>
    <b-table-column centered label="Shipping Dimensions Per Case" v-slot="props">
      <shipping-dimensions-column :product="props.row" />
    </b-table-column>
  </b-table>
</template>
<script setup>
import {
  AllocatableColumn,
  FbaQuantityColumn,
  InventoryColumn,
  ProductionMetricsColumn,
  QuantityPerCaseColumn,
  RecommendationColumn,
  RunRateColumn,
  ShippingDimensionsColumn,
  SkuColumn,
} from '@/components/SkuTable'
import { useFormatter, useSkuTable } from '@/composables'
import { enableStickyHeaders, enableTableNavigation } from '@/js/tableModifier'
import { delay } from '@/js/utilities/utilities'
import { useMarketplaceStore, useReplenishmentStore, useSettingsStore, useUIStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const marketplaceStore = useMarketplaceStore()
const replenishmentStore = useReplenishmentStore()
const settingsStore = useSettingsStore()
const uiStore = useUIStore()

const { skuTableData } = useSkuTable()

const { marketplaceCode } = storeToRefs(marketplaceStore)
const { replenishmentProducts } = storeToRefs(replenishmentStore)
const { getReplenishmentQuantity, setReplenishmentProduct } = replenishmentStore
const { inventoryColumns } = storeToRefs(settingsStore)
const { runRate, tableLoading, tablePagination } = storeToRefs(uiStore)

const onRowChecked = (checkedList, row) => {
  if (!row) return
  const isRowChecked = checkedList.some((checkedRow) => checkedRow.sku === row.sku)
  if (isRowChecked) {
    // If the row is now checked, add or update the product in replenishmentProducts
    const defaultQuantity = 1 // Define a default quantity if not already set
    setReplenishmentProduct({ productSku: row.sku, replenishmentQuantity: Math.max(getReplenishmentQuantity(row.sku), defaultQuantity) })
  } else {
    // If the row is now unchecked, remove the product from replenishmentProducts
    setReplenishmentProduct({ productSku: row.sku, replenishmentQuantity: 0 }) // Setting quantity to 0 will remove it
  }
}

const onAllRowsChecked = (checkedList) => {
  const rowsToCheck = checkedList.filter((row) => !checkedRows.value.includes(row))
  if (rowsToCheck.length > 0) {
    rowsToCheck.forEach((row) => {
      onRowChecked(checkedList, row)
    })
  } else {
    checkedRows.value.forEach((row) => {
      onRowChecked(checkedList, row)
    })
  }
}

const checkedRows = computed(() => {
  return skuTableData.value.filter((row) => Array.from(replenishmentProducts.value.keys()).includes(row.sku))
})

const isSkuSelected = (sku) => {
  return Array.from(replenishmentProducts.value.keys()).includes(sku)
}

onMounted(async () => {
  await delay(500)
  enableStickyHeaders()
  enableTableNavigation()
})
</script>
<style lang="scss">
.b-table {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .table-wrapper {
    @apply mb-1 mr-1 rounded-xl shadow;
    background-color: #fff;
    flex: 1 1 auto;
  }

  .table {
    margin-top: 0;

    thead {
      position: relative;
      z-index: 5;
    }

    th,
    td {
      white-space: nowrap;
    }

    th {
      &.is-sticky {
        background-color: #fff !important;
      }

      &:not(.is-sortable) .th-wrap > span:only-child {
        width: 100%;
      }
    }

    td {
      vertical-align: middle;

      .field.is-grouped {
        width: max-content;
      }

      &.is-sticky {
        &:hover {
          z-index: 2;
        }
      }

      .hover-show {
        opacity: 0;
        transform: translateX(0);
      }

      .b-numberinput {
        min-width: 10rem;
      }

      &:hover {
        .hover-show {
          opacity: 1;
          transform: translateX(0.5rem);
        }
      }

      &.has-text-right {
        .field.is-grouped {
          justify-content: flex-end;
        }
      }
      &.has-text-centered {
        .field.is-grouped {
          justify-content: center;
        }
      }
    }

    .select {
      &::after {
        z-index: 1 !important;
      }
    }
  }
}
</style>
