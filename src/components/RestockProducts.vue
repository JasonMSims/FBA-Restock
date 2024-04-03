<template>
  <div
    :class="[
      'box-border overflow-hidden',
      //'bg-white dark:bg-slate-800',
      'flex flex-col items-stretch',
      //'h-screen',
      //'w-full',
    ]"
  >
    <div class="relative isolate bg-white px-4 py-4 dark:bg-slate-800 sm:flex sm:items-center sm:px-6 lg:px-8">
      <div aria-hidden="true" class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute inset-x-0 bottom-0 h-px bg-slate-900/5 dark:bg-white/5"></div>
      </div>
      <div class="sm:flex-auto">
        <h1 class="">Restock Report</h1>
        <p class="mt-2 text-sm">Monitor run rates and calculate the correct quantities to maintain stock levels.</p>
      </div>
      <div class="relative max-w-2xl">
        <label class="sr-only" for="sku-search">Search for a SKU...</label>
        <input
          class="block w-full appearance-none rounded-md border-transparent bg-slate-100/50 px-8 py-2 text-right transition focus:outline-none focus:ring-0 dark:bg-slate-700"
          id="sku-search"
          placeholder="Search for a SKU..."
          type="text"
          v-model="skuInput"
        />
        <div class="pointer-events-none absolute inset-y-0 left-2 flex items-center justify-center">
          <MagnifyingGlassIcon aria-hidden="true" class="h-5 w-5" />
        </div>
        <div class="absolute inset-y-0 right-2 flex cursor-pointer items-center justify-center" v-if="skuInput">
          <XCircleIcon @click="clearSkuInput" aria-hidden="true" class="h-5 w-5" />
        </div>
      </div>
    </div>
    <ProductsTable />
  </div>
</template>
<script setup>
import { ProductsTable } from '@/components'
import { useUIStore } from '@/stores'
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { debounce } from 'lodash'
import { computed, ref } from 'vue'

const uiStore = useUIStore()
const updateSkuInput = debounce((input) => {
  uiStore.sku = input
  skuInputLoading.value = false
}, 1000)
const clearSkuInput = () => (uiStore.sku = '')
const skuInputLoading = ref(false)
const skuInput = computed({
  get: () => uiStore.sku,
  set: (input) => {
    skuInputLoading.value = true
    updateSkuInput(input)
  },
})
</script>
