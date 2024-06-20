import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const inventoryStatuses = ['inbound', 'working', 'reserved', 'fulfillable', 'total', 'unsellable', 'sellable']
  const includedInventoryStatuses = ref(['inbound', 'working', 'reserved', 'fulfillable'])
  const excludedInventoryStatuses = computed(() => {
    return inventoryStatuses.filter((status) => !includedInventoryStatuses.value.includes(status))
  })

  /* eslint */
  const inventoryColumns = ref([
    { name: 'Inbound', status: 'inbound' },
    { name: 'Working', status: 'working' },
    { name: 'Transfer', status: 'reserved' },
    { name: 'Available', status: 'fulfillable' },
  ])

  return {
    excludedInventoryStatuses,
    includedInventoryStatuses,
    inventoryColumns,
  }
})
