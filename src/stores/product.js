import { productService } from '@/js/services'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const kits = ref({})
  const productsLoading = ref(false)

  const fetchProductsAndKits = async () => {
    try {
      productsLoading.value = true
      const fetchedProducts = await productService.fetchProductsAndKits()
      if (fetchedProducts) {
        products.value = fetchedProducts.products || []
        kits.value = fetchedProducts.kits || {}
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      // await nextTick()
      productsLoading.value = false
    }
  }

  const isKit = (productSku) => kits.value[productSku] !== undefined

  // Fetch products as soon as the Store is initialized
  fetchProductsAndKits()

  return {
    isKit,
    kits,
    products,
    productsLoading,
  }
})
