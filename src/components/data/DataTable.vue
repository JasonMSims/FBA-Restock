<template>
  <div :class="['flex flex-col overflow-hidden backdrop-blur-0']">
    <section
      :class="['grid w-full overflow-auto blur-0']"
      :style="{
        'grid-template-columns': `${model ? 'max-content' : ''} repeat(${columns.length}, minmax(max-content, 1fr))`,
        'grid-template-rows': `auto repeat(${paginatedRows.length}, auto) 1fr`,
      }"
      ref="dataTableEl"
      role="table"
    >
      <DataTableHeaderRow>
        <template v-if="model">
          <template :key="column.name" v-for="column in [selectColumn]">
            <DataTableHeaderColumn v-model:column-widths="columnWidths" v-bind="column" :scrolled="isScrolled">
              <template #title>
                <Checkbox :items="allRows" v-model="model" />
              </template>
            </DataTableHeaderColumn>
          </template>
        </template>
        <template :key="column.name" v-for="column in columns">
          <DataTableHeaderColumn v-model:column-widths="columnWidths" v-bind="column" :scrolled="isScrolled" v-model="sort">
            <template #title>
              <slot :column="column" :name="`header-cell-${column.name}`">
                {{ column.label }}
              </slot>
            </template>
          </DataTableHeaderColumn>
        </template>
      </DataTableHeaderRow>
      <main :class="['col-span-full grid grid-cols-subgrid']" role="rowgroup">
        <DataTableRow
          :key="row[rowKey]"
          :last-row="rowIdx === paginatedRows.length - 1"
          :row="row"
          :selected="model?.includes(row[rowKey])"
          v-for="(row, rowIdx) in paginatedRows"
        >
          <template v-if="model">
            <DataTableColumn v-bind="column" :column-widths="columnWidths" :key="column.name" :scrolled="isScrolled" v-for="column in [selectColumn]">
              <span class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600 dark:bg-indigo-400" v-if="model?.includes(row[rowKey])"></span>
              <Checkbox :value="row[rowKey]" v-model="model" />
            </DataTableColumn>
          </template>
          <DataTableColumn :key="column.name" v-for="column in columns" v-bind="column" :column-widths="columnWidths" :scrolled="isScrolled">
            <slot :column="column" :name="`body-cell-${column.name}`" :row="row">
              {{ get(row, column.field) }}
            </slot>
          </DataTableColumn>
        </DataTableRow>
      </main>
    </section>
    <footer :class="['sticky bottom-0 z-20 col-span-full flex-grow bg-slate-50 dark:bg-slate-700']" v-if="hasFooter">
      <section>
        <slot name="footer">
          <Pagination
            :class="['w-full']"
            :label="label"
            :number-of-pages="numberOfPages"
            :number-of-rows="rows.length"
            :page-size="pageSize"
            show-pages
            v-model="currentPage"
          />
        </slot>
      </section>
    </footer>
  </div>
</template>
<script setup>
import { Checkbox, Pagination } from '@/components'
import { usePagination } from '@/composables'
import { useScroll } from '@vueuse/core'
import { get, orderBy } from 'lodash'
import { computed, reactive, ref, toRefs } from 'vue'

import { DataTableColumn, DataTableHeaderColumn, DataTableHeaderRow, DataTableRow } from './DataTable'

const model = defineModel()

const props = defineProps({
  columns: Array,
  hasFooter: { default: true, type: Boolean },
  initialSort: { default: [], tye: Array },
  label: String,
  rowKey: String,
  rows: Array,
})
const { columns, initialSort, rowKey, rows } = toRefs(props)
const allRows = computed(() => rows.value.map((row) => row[rowKey.value]))

const sort = ref([...initialSort.value] || [])
const sortedRows = computed(() =>
  orderBy(
    rows.value,
    sort.value.map(({ key }) => key),
    sort.value.map(({ order }) => order)
  )
)

const currentPage = ref(1)
const {
  numberOfPages,
  pageSize,
  paginatedArray: paginatedRows,
} = usePagination({
  arrayToPaginate: sortedRows,
  currentPage,
  pageSize: 50,
})

const selectColumn = { align: 'center', frozen: true, name: 'select' }

const columnWidths = reactive({})

const dataTableEl = ref(null)
const { x } = useScroll(dataTableEl, { throttle: 100 })
const isScrolled = computed(() => x.value > 0)
</script>
