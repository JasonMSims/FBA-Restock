<template>
  <b-field grouped>
    <!-- Box Dropdown -->
    <b-field label="Box" expanded>
      <b-dropdown
        v-model="currentShipping.name"
        @change="updateShippingInfo"
        aria-role="menu"
        :mobile-modal="false"
        :scrollable="true"
        :max-height="200"
      >
        <template #trigger="{ active }">
          <b-button type="is-white" :icon-right="active ? 'menu-up' : 'menu-down'">{{ currentShipping.name }}</b-button>
        </template>
        <b-dropdown-item value="Custom">Custom</b-dropdown-item>
        <b-dropdown-item v-if="defaultShipping.name !== 'Custom'" :value="defaultShipping.name">{{ defaultShipping.name }}</b-dropdown-item>
      </b-dropdown>
    </b-field>

    <!-- Dimension Inputs -->
    <b-field label="Width (in)">
      <b-numberinput
        v-model="currentShipping.dimensions.width"
        @input="updateShippingInfo"
        :controls="false"
        :disabled="currentShipping.name !== 'Custom'"
      ></b-numberinput>
    </b-field>
    <b-field label="Length (in)">
      <b-numberinput
        v-model="currentShipping.dimensions.length"
        @input="updateShippingInfo"
        :controls="false"
        :disabled="currentShipping.name !== 'Custom'"
      ></b-numberinput>
    </b-field>
    <b-field label="Height (in)">
      <b-numberinput
        v-model="currentShipping.dimensions.height"
        @input="updateShippingInfo"
        :controls="false"
        :disabled="currentShipping.name !== 'Custom'"
      ></b-numberinput>
    </b-field>

    <!-- Weight Display -->
    <b-field label="Weight (lb)">
      <b-numberinput :value="calculatedWeight" :controls="false" disabled></b-numberinput>
    </b-field>
  </b-field>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useReplenishmentStore, useShippingStore } from '@/stores'
import { debounce, cloneDeep } from 'lodash'

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
    default: defaultShipping.value,
    current: currentShipping.value,
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
