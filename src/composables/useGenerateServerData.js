import { useInventoryStore, useProductStore, useReplenishmentStore, useShippingStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export const useGenerateServerData = () => {
  const { amazonInventory } = storeToRefs(useInventoryStore())
  const { products } = storeToRefs(useProductStore())
  const { replenishmentComponents, replenishmentProducts } = storeToRefs(useReplenishmentStore())
  const { skuProcedures } = storeToRefs(useShippingStore())

  const fbaData = computed(() => {
    return Array.from(replenishmentProducts.value.entries()).map(([sku, replenishmentProduct]) => {
      const amazonData = amazonInventory.value[sku]
      const shippingData = skuProcedures.value[sku]

      return {
        amazon: {
          dimensions: amazonData?.dimensions,
        },
        replenishment: {
          quantity: replenishmentProduct.replenishmentQuantity,
          quantity_per_case: replenishmentProduct.quantityPerCase,
        },
        shipping: {
          current: shippingData?.shipping?.current,
        },
        sku: sku,
      }
    })
  })

  const poData = computed(() => {
    return Array.from(replenishmentComponents.value.entries()).map(([componentSku, component]) => {
      const productData = products.value.find((product) => product.sku === componentSku)

      return {
        allocated: component.allocated,
        sku: componentSku,
        supplier: productData?.supplier,
      }
    })
  })

  return { fbaData, poData }
}
