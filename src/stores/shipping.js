import { shippingService } from '@/js/services'
import { defineStore } from 'pinia'
import { nextTick, ref } from 'vue'

export const useShippingStore = defineStore('shipping', () => {
  const defaultShipping = ref({
    dimensions: {
      height: 0,
      length: 0,
      weight: 1,
      width: 0,
    },
    name: 'Custom',
  })

  const skuProcedures = ref({})
  const skuProceduresLoading = ref(false)

  function updateShippingCurrent(sku, updatedShipping) {
    if (skuProcedures.value[sku]) {
      // Create a new object for the updated shipping procedures
      skuProcedures.value = {
        ...skuProcedures.value,
        [sku]: {
          ...skuProcedures.value[sku],
          shipping: updatedShipping,
        },
      }
    } else {
      console.warn('SKU not found in SKU Procedures:', sku)
    }
  }

  async function fetchSkuProcedures() {
    try {
      skuProceduresLoading.value = true
      const fetchedSkuProcedures = await shippingService.fetchSkuProcedures()
      if (fetchedSkuProcedures) {
        for (const sku in fetchedSkuProcedures) {
          if (fetchedSkuProcedures[sku].shipping && fetchedSkuProcedures[sku].shipping.default) {
            // Create a deep copy of the default shipping and assign it to current
            fetchedSkuProcedures[sku].shipping.current = JSON.parse(JSON.stringify(fetchedSkuProcedures[sku].shipping.default))
          }
        }
        skuProcedures.value = fetchedSkuProcedures
      }
    } catch (error) {
      console.error('Failed to fetch SKU procedures:', error)
    } finally {
      await nextTick()
      skuProceduresLoading.value = false
    }
  }

  // Fetch SKU procedures as soon as the Store is initialized
  fetchSkuProcedures()

  return {
    defaultShipping,
    skuProcedures,
    updateShippingCurrent,
  }
})
