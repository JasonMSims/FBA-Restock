<template>
  <b-field grouped>
    <!-- Box Dropdown -->
    <b-field expanded label="Box">
      <b-dropdown
        :max-height="200"
        :mobile-modal="false"
        :scrollable="true"
        @change="updateShippingInfo"
        aria-role="menu"
        v-model="currentShipping.name"
      >
        <template #trigger="{ active }">
          <b-button :icon-right="active ? 'menu-up' : 'menu-down'" type="is-white">{{ currentShipping.name }}</b-button>
        </template>
        <b-dropdown-item value="Custom">Custom</b-dropdown-item>
        <b-dropdown-item :value="defaultShipping.name" v-if="defaultShipping.name !== 'Custom'">{{ defaultShipping.name }}</b-dropdown-item>
      </b-dropdown>
    </b-field>

    <!-- Dimension Inputs -->
    <b-field label="Length (in)">
      <b-numberinput
        :controls="false"
        :disabled="currentShipping.name !== 'Custom'"
        @input="updateShippingInfo"
        v-model="currentShipping.dimensions.length"
      ></b-numberinput>
    </b-field>
    <b-field label="Width (in)">
      <b-numberinput
        :controls="false"
        :disabled="currentShipping.name !== 'Custom'"
        @input="updateShippingInfo"
        v-model="currentShipping.dimensions.width"
      ></b-numberinput>
    </b-field>
    <b-field label="Height (in)">
      <b-numberinput
        :controls="false"
        :disabled="currentShipping.name !== 'Custom'"
        @input="updateShippingInfo"
        v-model="currentShipping.dimensions.height"
      ></b-numberinput>
    </b-field>

    <!-- Weight Display -->
    <b-field label="Weight (lb)">
      <b-numberinput :controls="false" :value="calculatedWeight" disabled></b-numberinput>
    </b-field>
  </b-field>
</template>

<script setup>
import { useReplenishmentStore, useShippingStore } from '@/stores'
import { cloneDeep, debounce } from 'lodash'
import { computed, ref } from 'vue'

const replenishmentStore = useReplenishmentStore()
const shippingStore = useShippingStore()
const props = defineProps({
  product: Object,
})

// Local state for the entire shipping objects
const currentShipping = ref({ ...props.product.shipping.current })
const defaultShipping = ref({ ...props.product.shipping.default })

// Debounced method to update shipping data in store
const updateShippingCurrent = debounce((sku, updatedShipping) => {
  shippingStore.updateShippingCurrent(sku, updatedShipping)
}, 500)

// Method to update shipping information
const updateShippingInfo = () => {
  // Check if the shipping setting has changed back to the default
  if (currentShipping.value.name !== 'Custom') {
    currentShipping.value = cloneDeep(defaultShipping.value)
  }

  const updatedShipping = {
    current: currentShipping.value,
    default: defaultShipping.value,
  }
  updateShippingCurrent(props.product.sku, updatedShipping)
}

// Computed property for calculated weight
const calculatedWeight = computed(() => {
  let weight = props.product.amazon?.dimensions?.weight?.value || 1
  let quantityPerCase = replenishmentStore.getQuantityPerCase(props.product.sku)
  let packingWeight = currentShipping.value.dimensions.weight || 1
  return Math.ceil(weight * quantityPerCase + packingWeight)
})
</script>
