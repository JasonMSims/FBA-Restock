<template>
  <div>
    <b-dropdown :mobile-modal="false" aria-role="list" v-if="isKit">
      <template #trigger="{ active }">
        <a role="button"><b-icon :icon="active ? 'menu-up' : 'menu-down'" type="is-info"></b-icon></a>
      </template>
      <div class="b-table">
        <table class="is-size-7 table">
          <thead></thead>
          <tr>
            <th class="has-text-left" colspan="2">Component</th>
            <th>Required</th>
            <th>Available</th>
            <th>Incoming</th>
          </tr>
          <tbody>
            <tr :key="index" v-for="(component, index) in kitComponents">
              <td class="has-text-weight-bold">{{ index + 1 }}</td>
              <td class="has-text-left">
                <div :key="product" v-for="product in component.products">{{ product }}</div>
              </td>
              <td>{{ useFormatter.number(component.required) }}</td>
              <td class="has-text-right">
                <span :class="getComponentQuantities(component.products).available < component.required ? ['tag', 'is-rounded', 'is-danger'] : []">{{
                  useFormatter.number(getComponentQuantities(component.products).available)
                }}</span>
              </td>
              <td>{{ useFormatter.number(getComponentQuantities(component.products).incoming) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-dropdown>
    <b-dropdown :mobile-modal="false" aria-role="list" v-else>
      <template #trigger="{ active }">
        <a role="button"><b-icon :icon="active ? 'menu-up' : 'menu-down'" type="is-success"></b-icon></a>
      </template>
      <div class="b-table">
        <table class="is-size-7 table">
          <thead></thead>
          <tr>
            <th>Available</th>
            <th>Incoming</th>
          </tr>
          <tbody>
            <tr>
              <td class="has-text-right">
                <span :class="allocatableClass">{{ formattedAllocatable }}</span>
              </td>
              <td>{{ formattedIncoming }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-dropdown>
    <span :class="allocatableClass">{{ formattedAllocatable }}</span>
  </div>
</template>

<script setup>
import { useFormatter } from '@/composables'
import { useProductStore, useReplenishmentStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const props = defineProps({
  product: Object,
})
const productStore = useProductStore()
const replenishmentStore = useReplenishmentStore()

const { kits, products } = storeToRefs(productStore)
const { replenishmentComponents } = storeToRefs(replenishmentStore)
const { getAllocatableQuantity } = replenishmentStore

const isKit = computed(() => kits.value[props.product.sku] !== undefined)
const kitComponents = computed(() => (isKit.value ? kits.value[props.product.sku].components : []))

const allocatableClass = computed(() => {
  return parseInt(formattedAllocatable.value) < 1 ? ['tag', 'is-rounded', 'is-danger', 'is-medium'] : []
})

const formattedAllocatable = computed(() => {
  return useFormatter.number(getAllocatableQuantity(props.product.sku))
})
const formattedIncoming = computed(() => {
  return useFormatter.number(props.product.warehouse.inventory.incoming)
})

const getComponentQuantities = (componentProducts) => {
  return products.value.reduce(
    (quantities, product) => {
      if (componentProducts.includes(product.sku)) {
        quantities.available += product.warehouse.inventory.available - (replenishmentComponents?.[product.sku]?.allocated || 0)
        quantities.incoming += product.warehouse.inventory.incoming
      }
      return quantities
    },
    { available: 0, incoming: 0 }
  )
}
</script>
