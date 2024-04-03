<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Input :class="classes" :min="min" type="number" v-model.number="model" v-bind="$attrs" />
</template>
<script setup>
import { Input } from '@/components'
const model = defineModel()
defineProps({
  classes: {
    default: '',
    type: String,
  },
  min: {
    default: 0,
    type: Number,
  },
})

defineOptions({
  inheritAttrs: false,
})
</script>
