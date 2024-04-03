<template>
  <div>
    <b-tooltip type="is-info" v-if="optimizedShipQty">
      <b-numberinput controls-position="compact" controls-rounded min="1" type="is-info" v-model="localOptimizedShipQty" />
      <template v-slot:content>
        <div>
          Box: <b>{{ optimizedShipQty }}</b>
        </div>
        <div>
          Pallet: <b>{{ optimizedShipQty }}</b>
        </div>
      </template>
    </b-tooltip>
    <b-numberinput controls-position="compact" controls-rounded min="1" type="is-info" v-else v-model="localOptimizedShipQty" />
  </div>
</template>

<script setup>
import { useReplenishmentStore } from '@/stores'
import { debounce } from 'lodash'
import { computed, ref } from 'vue'

const replenishmentStore = useReplenishmentStore()
const props = defineProps({
  optimizedShipQty: Number,
  sku: String,
})

const updateQuantityPerCase = debounce((productSku, quantityPerCase) => {
  replenishmentStore.setReplenishmentProduct({ productSku, quantityPerCase })
}, 500)

const localOptimizedShipQty = computed({
  get() {
    return replenishmentStore.getQuantityPerCase(props.sku)
  },
  set(value) {
    updateQuantityPerCase(props.sku, value)
  },
})
</script>
