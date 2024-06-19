<template>
  <section
    :class="[
      'flex items-center justify-items-stretch px-3 py-3.5 text-sm',
      {
        'bg-inherit': frozen,
        'justify-center': align === 'center',
        'justify-end': align === 'right',
      },
    ]"
    :style="columnStyle"
    role="cell"
  >
    <slot></slot>
    <span
      :class="[
        'absolute bottom-[-1px] right-0 top-0 w-8 translate-x-full border-l-4 border-slate-200 shadow-[16px_0_24px_-24px_rgba(0,0,0,0.15)_inset] dark:border-slate-500',
      ]"
      v-show="frozen /*&& lastFrozenColumn*/ && scrolled"
    ></span>
  </section>
</template>
<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  align: { default: 'left', type: String },
  columnWidths: { default: () => ({}), type: Object },
  frozen: { default: false, type: Boolean },
  name: String,
  scrolled: { default: false, type: Boolean },
})

const { columnWidths, frozen, name } = toRefs(props)

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
    zIndex: 20,
  }
})
</script>
