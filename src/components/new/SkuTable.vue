<template>
  <div class="flex w-full flex-col overflow-hidden bg-white shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg" v-if="!skuTableDataLoading">
    <div @scroll="tableScroll" class="relative flex-1 overflow-auto">
      <table class="min-w-full table-fixed border-separate border-spacing-0">
        <thead class="sticky top-0 z-40">
          <tr>
            <th class="sticky left-0 z-10 w-12 border-b border-slate-200 bg-slate-50 bg-opacity-90 px-6 backdrop-blur sm:w-16 sm:px-8" scope="col">
              <Checkbox :all-items="skuTableData.map((p) => p.sku)" :is-master-toggle="true" v-model="selectedProducts" />
            </th>
            <th
              :class="[
                'sticky left-16 z-10 -mx-2 min-w-[12rem] border-b border-slate-200 bg-slate-50 bg-opacity-90 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 backdrop-blur transition-all',
                tableScrolled ? 'border-r-4' : 'border-r-0',
              ]"
              scope="col"
            >
              <ColumnHeader :currentSort="sort" @remove-sort-by="removeSortBy" @sort-by="sortBy" sortKey="sku"
                ><template #title>SKU</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-left text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader :currentSort="sort" @remove-sort-by="removeSortBy" @sort-by="sortBy" sortKey="amazon.price"
                ><template #title>Price</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-right text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader :alignRight="true" :currentSort="sort" :sortKey="`unitsSold['30d']`" @remove-sort-by="removeSortBy" @sort-by="sortBy"
                ><template #title>Units Sold (30 Days)</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-right text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader :alignRight="true" :currentSort="sort" :sortKey="`unitsSold['7d']`" @remove-sort-by="removeSortBy" @sort-by="sortBy"
                ><template #title>Units Sold (7 Days)</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-right text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              :key="columnId"
              scope="col"
              v-for="(columnId, columnName) in inventoryColumns"
            >
              <ColumnHeader
                :alignRight="true"
                :currentSort="sort"
                :sortKey="`amazon.inventory.${columnId}`"
                @remove-sort-by="removeSortBy"
                @sort-by="sortBy"
              >
                <template #title>
                  <Checkbox :value="columnId" @click.stop v-model="includedInventoryStatuses" />
                  {{ columnName }} Inventory
                </template>
              </ColumnHeader>
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-right text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              Total Inventory
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-right text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader
                :alignRight="true"
                :currentSort="sort"
                @remove-sort-by="removeSortBy"
                @sort-by="sortBy"
                sortKey="amazon.inventory.allocatable"
              >
                <template #title>Allocatable Inventory</template>
              </ColumnHeader>
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-center text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader
                :currentSort="sort"
                :sortKey="`runRate['${settingsStore.duration}']`"
                @remove-sort-by="removeSortBy"
                @sort-by="sortBy"
                alignCenter
                ><template #title>Run Rate</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-right text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader :currentSort="sort" @remove-sort-by="removeSortBy" @sort-by="sortBy" alignRight sortKey="daysOnHand"
                ><template #title>Days On-Hand</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-center text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader
                :currentSort="sort"
                :sortKey="`replenishmentRecommendation['${settingsStore.duration}']`"
                @remove-sort-by="removeSortBy"
                @sort-by="sortBy"
                alignCenter
                ><template #title>Recommendation</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-right text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              <ColumnHeader :currentSort="sort" @remove-sort-by="removeSortBy" @sort-by="sortBy" alignRight sortKey="onHandAlert.message"
                ><template #title>On-Hand Alert</template></ColumnHeader
              >
            </th>
            <th
              :class="[
                'whitespace-nowrap border-b border-slate-200 bg-slate-50 bg-opacity-90 px-3 py-3.5 text-center text-sm font-semibold text-slate-900 backdrop-blur',
              ]"
              scope="col"
            >
              FBA Quantity
            </th>
          </tr>
        </thead>
        <tbody class="relative divide-y divide-slate-200 bg-white">
          <SkuRow
            :inventory-statuses="includedInventoryStatuses"
            :key="product.sku"
            :product="product"
            :tableScrolled="tableScrolled"
            v-for="product in paginatedProducts"
            v-model:selected-products="selectedProducts"
          />
        </tbody>
      </table>
    </div>
    <PaginationComponent
      :number-of-pages="numberOfPages"
      :number-of-rows="sortedProducts.length"
      :page-size="pageSize"
      label="SKUs"
      show-pages
      v-model="currentPage"
    />
  </div>
  <span class="inline-flex animate-pulse items-center text-sm font-semibold text-slate-500" v-else>
    <svg class="mr-2 h-5 w-5 animate-spin text-purple-500" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path
        class="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      ></path>
    </svg>
    Loading Products...
  </span>
</template>
<script setup>
import { Checkbox } from '@/components/elements'
import { ColumnHeader, SkuRow } from '@/components/new'
import PaginationComponent from '@/components/pagination/PaginationComponent.vue'
import { useSkuTable } from '@/composables'
import { usePagination } from '@/composables/usePagination'
import { useSettingsStore, useUIStore } from '@/stores'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const settingsStore = useSettingsStore()
const uiStore = useUIStore()

const { includedInventoryStatuses, inventoryColumns } = storeToRefs(settingsStore)
const { skuTableData, skuTableDataLoading } = useSkuTable()

const skuInput = defineModel({ default: '', type: String })
const sort = ref([])

const sortBy = (key) => {
  let existing = sort.value.find((s) => s.key === key)
  existing ? (existing.order = existing.order === 'desc' ? 'asc' : 'desc') : sort.value.push({ key, order: 'asc' })
}

const removeSortBy = (key) => {
  sort.value = sort.value.filter((s) => s.key !== key)
}

const sortedProducts = computed(() =>
  _.orderBy(
    skuTableData.value,
    sort.value.map((s) => s.key),
    sort.value.map((s) => s.order)
  )
)

const selectedProducts = ref([])

const pageSize = ref(50)
const currentPage = ref(1)
const { numberOfPages, paginatedArray: paginatedProducts } = usePagination({ arrayToPaginate: sortedProducts, currentPage, pageSize })

watch(skuInput, () => (currentPage.value = 1), { deep: true })

const tableScrolled = ref(false)
const tableScroll = (e) => (tableScrolled.value = e.target.scrollLeft > 0)
</script>
