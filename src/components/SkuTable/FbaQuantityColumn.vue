<template>
  <b-numberinput :step="stepValue" controls-position="compact" controls-rounded min="0" type="is-success" v-model="currentQuantity"></b-numberinput>
</template>

<script setup>
import { useReplenishmentStore } from '@/stores'
import { debounce } from 'lodash'
import { computed, ref } from 'vue'

const replenishmentStore = useReplenishmentStore()
const props = defineProps({
  sku: String,
})

const roundToCasePack = ref(false)
const stepValue = computed(() => (roundToCasePack.value ? currentQuantity : 1))

const setReplenishmentProduct = debounce((productSku, replenishmentQuantity) => {
  replenishmentStore.setReplenishmentProduct({ productSku, replenishmentQuantity })
}, 500)

const currentQuantity = computed({
  get() {
    return replenishmentStore.getReplenishmentQuantity(props.sku)
  },
  set(value) {
    setReplenishmentProduct(props.sku, value)
  },
})
</script>
