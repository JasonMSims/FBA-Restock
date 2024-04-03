import { defineStore, storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'

import { useProductStore, useShippingStore } from './'

export const useReplenishmentStore = defineStore('replenishment', () => {
  const { kits, productsLoading } = storeToRefs(useProductStore())
  const { isKit } = useProductStore()
  const { skuProcedures } = storeToRefs(useShippingStore())

  const products = computed(() => new Map(useProductStore().products.map((product) => [product.sku, { inventory: product?.warehouse.inventory }])))

  const replenishmentProducts = reactive(new Map())

  const replenishmentComponents = computed(() => {
    const allocation = new Map()

    replenishmentProducts.forEach(({ replenishmentQuantity }, replenishmentProduct) => {
      const components = kits.value[replenishmentProduct]?.components ?? [{ products: [replenishmentProduct], required: 1 }]

      components.forEach((component) => {
        let requiredTotal = replenishmentQuantity * component.required

        component.products.forEach((coreProduct, index, array) => {
          if (!allocation.has(coreProduct)) {
            allocation.set(coreProduct, { allocated: 0 })
          }
          let isLastProduct = index === array.length - 1
          const allocated = allocation.get(coreProduct).allocated
          const available = products.value.get(coreProduct)?.inventory.available ?? 0
          const allocatable = isLastProduct ? requiredTotal : Math.min(requiredTotal, available - allocated)
          allocation.set(coreProduct, { allocated: allocated + allocatable })
          requiredTotal -= allocatable
        })
      })
    })
    return allocation
  })

  const setReplenishmentProduct = ({ productSku, quantityPerCase = null, replenishmentQuantity = null }) => {
    const existingProduct = replenishmentProducts.get(productSku)
    if (existingProduct) {
      // Existing product
      if (replenishmentQuantity !== null && replenishmentQuantity <= 0) {
        // Remove the product if replenishmentQuantity is 0 or less
        removeReplenishmentProduct(productSku)
        return
      }

      const updates = {}
      if (replenishmentQuantity !== null) {
        updates.replenishmentQuantity = replenishmentQuantity
      }
      if (quantityPerCase !== null) {
        updates.quantityPerCase = quantityPerCase
      }

      if (Object.keys(updates).length > 0) {
        updateReplenishmentProduct({ productSku, ...updates })
      }
    } else if (replenishmentQuantity > 0) {
      // Add new product if it doesn't exist and replenishmentQuantity is greater than 0
      addReplenishmentProduct({ productSku, quantityPerCase, replenishmentQuantity })
    }
  }

  const addReplenishmentProduct = ({ productSku, quantityPerCase, replenishmentQuantity }) => {
    const newProduct = {
      quantityPerCase: quantityPerCase ?? getOptimizedShipQuantity(productSku),
      replenishmentQuantity,
    }
    replenishmentProducts.set(productSku, newProduct)
  }

  const removeReplenishmentProduct = (productSku) => {
    replenishmentProducts.delete(productSku)
  }

  const updateReplenishmentProduct = ({ productSku, quantityPerCase = null, replenishmentQuantity = null }) => {
    const existingProduct = replenishmentProducts.get(productSku)
    if (existingProduct) {
      if (replenishmentQuantity !== null) {
        existingProduct.replenishmentQuantity = replenishmentQuantity
      }
      if (quantityPerCase !== null) {
        existingProduct.quantityPerCase = quantityPerCase
      }
      replenishmentProducts.set(productSku, existingProduct)
    }
  }

  function getOptimizedShipQuantity(productSku) {
    // Returns the optimized ship quantity for the given SKU
    return skuProcedures.value[productSku]?.optimized_ship_quantity ?? 1 // default value if not found
  }

  const getQuantityPerCase = (productSku) => {
    const product = replenishmentProducts.get(productSku)
    return product?.quantityPerCase ?? getOptimizedShipQuantity(productSku)
  }

  const getReplenishmentQuantity = (productSku) => {
    const product = replenishmentProducts.get(productSku)
    return product?.replenishmentQuantity ?? 0
  }

  const getAllocatableQuantity = (productSku) => {
    const product = products.value.get(productSku)
    if (!product) return 0

    let buildable = 0
    if (isKit(productSku)) {
      // If the `product` is a kit
      let components = kits.value[productSku].components.map((component) => {
        // Map the Components of the `product`
        let quantities = component.products.map(
          // Map the Core Products of the `component`
          (coreProduct) => {
            let available = products.value.get(coreProduct)?.inventory.available ?? 0
            let allocated = replenishmentComponents.value.get(coreProduct)?.allocated ?? 0
            return available - allocated // Return the allocatable quantity of each Core Product
          }
        )
        // return (Math.max(...quantities) < 0 ? Math.max(...quantities) : quantities.reduce((a, b) => a + b, 0)) / component.required
        return quantities.reduce((a, b) => a + b, 0) / component.required
      })
      buildable = Math.floor(Math.min(...components)) // Return the highest amount of the `product` that can be built based on the quantity required of all the `components`
    }

    const allocated = replenishmentComponents.value.get(productSku)?.allocated || 0
    return product.inventory.available + buildable - allocated
  }

  const getReplenishmentComponentsBySku = (productSku) => {
    const components = kits.value[productSku]?.components || [{ products: [productSku], required: 1 }]

    return components.map((component, idx) => {
      const productData = getReplenishmentComponentQuantities(component.products)

      return {
        id: idx + 1,
        required: component.required,
        ...productData,
        sku: productData.products[0].sku,
      }
    })
  }

  const getReplenishmentComponentQuantities = (componentProducts) => {
    let totalAllocatable = 0
    let totalIncoming = 0

    const productsArray = componentProducts.map((sku) => {
      const product = products.value.get(sku)
      const allocated = replenishmentComponents.value.get(sku)?.allocated ?? 0
      const allocatable = product?.inventory.available - allocated ?? 0
      const incoming = product?.inventory.incoming ?? 0

      totalAllocatable += allocatable
      totalIncoming += incoming

      return {
        allocatable,
        incoming,
        sku,
      }
    })

    return {
      products: productsArray,
      totalAllocatable,
      totalIncoming,
    }
  }

  return {
    getAllocatableQuantity,
    getQuantityPerCase,
    getReplenishmentComponentsBySku,
    getReplenishmentQuantity,
    products,
    productsLoading,
    replenishmentComponents,
    replenishmentProducts,
    setReplenishmentProduct,
  }
})
