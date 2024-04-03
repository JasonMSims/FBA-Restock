<script setup>
import { PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  pulse: { type: Boolean, default: true },
})
</script>
<template>
  <header class="h-12 border-b border-gray-300 bg-slate-50"></header>
  <div :class="[{ 'animate-pulse': pulse }, 'mx-auto flex w-full items-center justify-between rounded-md bg-white px-4 py-3 transition sm:px-6']">
    <slot>
      <section class="flex w-1/4 items-center space-x-4 py-4">
        <div class="h-24 w-24 rounded-md bg-slate-200 p-2">
          <PhotoIcon class="text-slate-300" />
        </div>
        <div class="flex-grow space-y-2">
          <div class="grid w-full grid-cols-4 items-center gap-2">
            <div class="col-span-4 h-3 rounded-full bg-slate-200"></div>
          </div>
          <div class="grid w-full grid-cols-4 items-center gap-2">
            <div class="col-span-2 h-3 rounded-full bg-slate-200"></div>
            <div class="col-span-1 h-3 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </section>
      <section class="ml-8 flex flex-grow flex-col justify-center py-4">
        <div class="grid grid-cols-5 items-center gap-2">
          <div class="flex flex-col items-center space-y-3" v-for="i in 5" :key="i">
            <div class="flex space-x-3">
              <div class="h-3 w-3 rounded-full bg-slate-200"></div>
              <div class="h-3 w-12 rounded-full bg-slate-200"></div>
            </div>
            <div class="h-3 w-24 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </section>
    </slot>
  </div>
</template>
