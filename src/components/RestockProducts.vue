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
        <h1 class="">FBA Restock</h1>
        <p class="mt-2 text-sm">Monitor run rates and calculate the correct quantities to maintain stock levels.</p>
      </div>
      <Search />
    </div>
    <ProductsTable />
  </div>
</template>
<script setup>
import { ProductsTable, Search } from '@/components'
</script>
