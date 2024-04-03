<template>
  <section
    :class="[
      `relative col-span-full grid grid-cols-subgrid border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-700`,
      selected ? 'bg-slate-100  dark:bg-slate-700 ' : 'bg-white  dark:bg-slate-600',
      lastRow ? 'border-b-transparent dark:border-b-transparent' : 'border-slate-200 dark:border-slate-500',
    ]"
    role="row"
  >
    <slot></slot>
  </section>
</template>
<script setup>
defineProps({
  lastRow: { default: false, type: Boolean },
  row: Object,
  selected: { default: false, type: Boolean },
})
</script>
