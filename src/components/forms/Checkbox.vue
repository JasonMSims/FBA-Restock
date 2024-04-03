<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <input
    :checked="isChecked"
    :class="['dark:focus-ring-indigo-300 m-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 dark:text-indigo-400']"
    :indeterminate="isIndeterminate"
    :value="value"
    @change="handleChange"
    type="checkbox"
    v-model="model"
  />
</template>
<script setup>
import { computed } from 'vue'

const model = defineModel()
const props = defineProps({
  items: { default: () => [], type: Array },
  value: { default: () => [], type: [String, Array] },
})

const isChecked = computed(() => {
  if (props.items.length) {
    return props.items.every((item) => model.value.includes(item))
  }
  return model.value.includes(props.value)
})

const isIndeterminate = computed(() => {
  if (props.items.length) {
    const someItemsIncluded = props.items.some((item) => model.value.includes(item))
    const allItemsIncluded = props.items.every((item) => model.value.includes(item))
    return someItemsIncluded && !allItemsIncluded
  }
  return false
})

const handleChange = () => {
  if (props.items.length) {
    model.value = model.value.length === props.items.length ? [] : [...props.items]
  }
}
</script>
