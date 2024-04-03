<template>
  <Tag :label="asin" type="is-success">
    <template #content>
      <span class="-ml-8 flex opacity-0 transition-spacing group-hover/tag:ml-1 group-hover/tag:space-x-1 group-hover/tag:opacity-100">
        <a :href="`https://amazon.com/dp/${asin}`" target="_blank">
          <ArrowTopRightOnSquareIcon
            :icon="['fas', 'arrow-right-from-bracket']"
            class="h-4 w-4 text-slate-400 transition hover:text-slate-700 active:rotate-6 active:scale-125 dark:text-slate-300 dark:hover:text-slate-100 dark:active:text-slate-100"
          />
        </a>
        <a @click.stop.prevent="copy(asin)" href="#">
          <ClipboardDocumentListIcon
            :icon="['far', 'copy']"
            class="h-4 w-4 text-slate-400 transition hover:text-slate-700 active:rotate-6 active:scale-125 dark:text-slate-300 dark:hover:text-slate-100 dark:active:text-slate-100"
          />
        </a>
      </span>
    </template>
  </Tag>
</template>
<script setup>
import { ArrowTopRightOnSquareIcon, ClipboardDocumentListIcon } from '@heroicons/vue/24/outline'

import Tag from './Tag.vue'

defineProps({
  asin: String,
})
const copy = async (value) => navigator.clipboard.writeText(value)
</script>
