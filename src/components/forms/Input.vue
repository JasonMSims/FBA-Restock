<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <input
    :class="classes"
    :min="min"
    :type="type"
    class="relative cursor-default rounded-md border border-slate-300 bg-white py-2 text-center shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm dark:border-slate-500 dark:bg-slate-800/30"
    v-model="model"
    v-bind="$attrs"
  />
</template>
<script setup>
const model = defineModel()
defineProps({
  classes: {
    default: '',
    type: String,
  },
  min: {
    default: null,
    type: Number,
  },
  type: {
    default: 'text',
    type: String,
  },
})

defineOptions({
  inheritAttrs: false,
})
</script>
