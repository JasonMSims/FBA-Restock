<template>
  <section
    :class="[
      'sticky left-0 top-0 z-30 border-b border-slate-200 bg-slate-50/90 px-3 py-3.5 text-sm font-medium backdrop-blur transition-all first:rounded-tl-lg last:rounded-tr-lg dark:border-slate-500 dark:bg-slate-700/90',
      'group/header flex items-center',
      sortable ? 'cursor-pointer' : 'cursor-default',
      { 'text-indigo-600 dark:text-indigo-300': current },
      { 'justify-center': align === 'center' },
      { 'justify-end': align === 'right' },
    ]"
    :style="columnStyle"
    @click="sortBy"
    ref="el"
    role="rowheader"
  >
    <template v-if="sortable">
      <span
        :class="[
          'z-10 flex whitespace-nowrap transition-all',
          {
            'translate-x-5 group-hover/header:translate-x-2.5 group-focus/header:translate-x-2.5': !current && align === 'center',
            'translate-x-10 group-hover/header:translate-x-5 group-focus/header:translate-x-5': !current && align === 'right',
          },
        ]"
      >
        <slot name="title"></slot>
      </span>
      <span
        :class="[
          'flex items-center rounded transition-all group-hover/header:opacity-100 group-focus/header:opacity-100',
          {
            '-translate-x-10 opacity-0 group-hover/header:-translate-x-5 group-focus/header:-translate-x-5': !current && align === 'left',
            '-translate-x-5 opacity-0 group-hover/header:-translate-x-2.5 group-focus/header:-translate-x-2.5': !current && align === 'center',
            'opacity-0': !current && align === 'right',
          },
        ]"
      >
        <span
          :class="[
            'ml-1 scale-90 select-none items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs transition-all dark:bg-indigo-400/25 dark:text-indigo-400',
          ]"
          v-if="current && model.length > 1"
        >
          {{ currentIndex + 1 }}
        </span>
        <ArrowDownIcon
          :class="[
            current ? 'text-inherit' : 'translate-x-5 text-slate-400',
            { 'rotate-180': current && current.order !== 'desc' },
            'z-10 mx-1 size-4 transition-all',
          ]"
          aria-hidden="true"
        />
        <XCircleIcon
          :class="[
            'size-5 text-slate-200 transition-all hover:text-slate-400 dark:text-slate-500 dark:hover:text-slate-400',
            current ? 'rotate-[360deg] opacity-100' : 'opacity-0',
            { '-translate-x-5': !current && align !== 'left' },
          ]"
          @click.stop="removeSortBy"
          aria-hidden="true"
        />
      </span>
    </template>
    <template v-else>
      <slot name="title"></slot>
    </template>
    <span
      :class="[
        'absolute bottom-[-1px] right-0 top-0 w-8 translate-x-full border-l-4 border-slate-200 shadow-[16px_0_24px_-24px_rgba(0,0,0,0.15)_inset] dark:border-slate-500',
      ]"
      v-show="frozen /*&& lastFrozenColumn*/ && scrolled"
    ></span>
  </section>
</template>
<script setup>
import { ArrowDownIcon } from '@heroicons/vue/20/solid'
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { useElementSize } from '@vueuse/core'
import { computed, reactive, ref, toRefs, watchEffect } from 'vue'

const el = ref(null)

const model = defineModel({ default: [] })
const columnWidths = defineModel('columnWidths', reactive({}))

const props = defineProps({
  align: { default: 'left', type: String },
  field: String,
  frozen: { default: false, type: Boolean },
  name: String,
  scrolled: { default: false, type: Boolean },
  sortable: { default: false, type: Boolean },
})
const { field, frozen, name, sortable } = toRefs(props)

const lastFrozenColumn = computed(() => Object.keys(columnWidths.value)[Object.keys(columnWidths.value).length - 1] === name.value)

const columnStyle = computed(() => {
  if (!frozen.value) return {}
  let leftOffset = 0
  for (const frozenColumnName of Object.keys(columnWidths.value)) {
    if (frozenColumnName === name.value) break
    leftOffset += columnWidths.value[frozenColumnName] || 0
  }

  return {
    left: `${leftOffset}px`,
    position: 'sticky',
    zIndex: 40,
  }
})

const { width: columnWidth } = useElementSize(el, { height: 0, width: 0 }, { box: 'border-box' })

watchEffect(() => {
  if (!frozen.value) return
  columnWidths.value[name.value] = columnWidth.value
})

const current = computed(() => model.value.find((sort) => sort.key === field.value))
const currentIndex = computed(() => model.value.indexOf(current.value))

const sortBy = () => {
  if (sortable.value) {
    let existing = model.value.find((s) => s.key === field.value)
    existing ? (existing.order = existing.order === 'desc' ? 'asc' : 'desc') : model.value.push({ key: field.value, order: 'asc' })
  }
}

const removeSortBy = () => {
  model.value = model.value.filter((s) => s.key !== field.value)
}
</script>
