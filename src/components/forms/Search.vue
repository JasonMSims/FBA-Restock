<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="relative">
    <label class="sr-only" for="sku-search">Search for a SKU...</label>
    <input
      :class="[
        'block w-full appearance-none border-transparent bg-slate-100/50 px-8 py-2 transition focus:outline-none focus:ring-0 dark:bg-slate-700',
        inputAlignClass,
        inputRoundedClass,
      ]"
      id="sku-search"
      placeholder="Search for a SKU..."
      type="text"
      v-model="skuInput"
    />
    <div class="pointer-events-none absolute inset-y-0 left-2 flex items-center justify-center">
      <MagnifyingGlassIcon aria-hidden="true" class="h-5 w-5" />
    </div>
    <div class="absolute inset-y-0 right-2 flex cursor-pointer items-center justify-center" v-if="skuInput">
      <XCircleIcon @click="clearSkuInput" aria-hidden="true" class="h-5 w-5" />
    </div>
  </div>
</template>
<script setup>
import { useUIStore } from '@/stores'
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { debounce } from 'lodash'
import { computed, ref } from 'vue'

const uiStore = useUIStore()
const updateSkuInput = debounce((input) => {
  uiStore.sku = input
  skuInputLoading.value = false
}, 1000)

const props = defineProps({
  align: {
    default: 'right',
    type: String,
  },
  rounded: {
    type: String,
  },
})

const inputAlignClass = computed(() => {
  if (props.align === 'left') {
    return 'text-left'
  } else if (props.align === 'right') {
    return 'text-right'
  } else {
    return 'text-center'
  }
})

const inputRoundedClass = computed(() => {
  if (props.rounded === 'full') {
    return 'rounded-full'
  } else if (props.rounded === 'none') {
    return 'rounded-none'
  } else {
    return 'rounded-lg'
  }
})

const clearSkuInput = () => (uiStore.sku = '')
const skuInputLoading = ref(false)
const skuInput = computed({
  get: () => uiStore.sku,
  set: (input) => {
    skuInputLoading.value = true
    updateSkuInput(input)
  },
})
</script>
