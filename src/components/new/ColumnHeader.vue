<template>
  <span :class="['group inline-flex cursor-pointer items-center', current ? 'text-indigo-600' : '']" @click="$emit('sortBy', sortKey)">
    <span
      :class="[
        'whitespace-nowrap transition-all',
        current
          ? alignRight || alignCenter
            ? 'translate-x-0'
            : ''
          : alignRight
            ? 'translate-x-10 group-hover:translate-x-5 group-focus:translate-x-5'
            : alignCenter
              ? 'translate-x-5 group-hover:translate-x-0 group-focus:translate-x-0'
              : '',
      ]"
    >
      <slot name="title"></slot>
    </span>
    <span
      :class="[
        'flex items-center rounded transition-all group-hover:opacity-100 group-focus:opacity-100',
        current
          ? 'translate-x-0'
          : alignRight
            ? 'translate-x-5 opacity-0'
            : '-translate-x-5 opacity-0 group-hover:translate-x-0 group-focus:translate-x-0',
      ]"
    >
      <div
        v-if="current && currentSort.length > 1"
        :class="['ml-1 inline-flex scale-90 select-none items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs transition-all']"
      >
        {{ currentIndex + 1 }}
      </div>
      <ArrowDownIcon
        :class="[current ? 'text-inherit' : 'text-slate-400', current && current.order !== 'desc' ? 'rotate-180' : '', 'z-10 h-4 w-4 transition-all']"
        aria-hidden="true"
      />
      <XCircleIcon
        :class="[current ? 'translate-x-0 rotate-[360deg] opacity-100' : 'opacity-0', 'h-5 w-5 text-slate-200 transition-all hover:text-slate-400']"
        @click.stop="$emit('removeSortBy', sortKey)"
        aria-hidden="true"
      />
    </span>
  </span>
</template>
<script setup>
import { ArrowDownIcon } from '@heroicons/vue/20/solid'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'

const current = computed(() => props.currentSort.find((sort) => sort.key === props.sortKey))
const currentIndex = computed(() => props.currentSort.indexOf(current.value))

const props = defineProps({
  sortName: String,
  sortKey: String,
  currentSort: Array,
  alignRight: Boolean,
  alignCenter: Boolean,
})
</script>
