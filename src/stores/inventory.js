import { inventoryService } from '@/js/services'
import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const amazonInventory = ref({})
  const inventoryLoading = ref(false)

  async function fetchAmazonInventory() {
    try {
      inventoryLoading.value = true
      const fetchedInventory = await inventoryService.fetchAmazonInventory()
      if (fetchedInventory) {
        amazonInventory.value = fetchedInventory || {}
      }
    } catch (error) {
      console.error('Failed to fetch Amazon inventory:', error)
    } finally {
      await nextTick()
      inventoryLoading.value = false
    }
  }

  // Fetch Amazon inventory as soon as the Store is initialized
  fetchAmazonInventory()
  return { amazonInventory, inventoryLoading }
})
