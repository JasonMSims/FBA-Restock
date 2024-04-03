import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const inventoryStatuses = ['inbound', 'working', 'reserved', 'fulfillable', 'total', 'unsellable', 'sellable']
  const includedInventoryStatuses = ref(['inbound', 'working', 'reserved', 'fulfillable'])
  const excludedInventoryStatuses = computed(() => {
    return inventoryStatuses.filter((status) => !includedInventoryStatuses.value.includes(status))
  })

  const inventoryColumns = ref({ Available: 'fulfillable', Inbound: 'inbound', Transfer: 'reserved', Working: 'working' })

  return {
    excludedInventoryStatuses,
    includedInventoryStatuses,
    inventoryColumns,
  }
})
