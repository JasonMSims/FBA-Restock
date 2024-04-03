import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import { warehouseService } from '@/js/services'

export const useWarehouseStore = defineStore('warehouse', () => {
  const warehouses = ref([])

  const warehousesLoading = ref(false)

  async function fetchWarehouses() {
    // Fetch the `products` array from the server
    try {
      warehousesLoading.value = true
      const fetchedWarehouses = await warehouseService.fetchWarehouses()
      if (fetchedWarehouses) {
        warehouses.value = fetchedWarehouses || []
      }
    } catch (error) {
      console.error(`Failed to fetch warehouses:`, error)
    } finally {
      await nextTick()
      warehousesLoading.value = false
    }
  }

  // Fetch products as soon as the Store is initialized
  fetchWarehouses()

  return {
    warehouses,
  }
})
