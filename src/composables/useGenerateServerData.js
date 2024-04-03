import { useInventoryStore, useProductStore, useReplenishmentStore, useShippingStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export const useGenerateServerData = () => {
  const { amazonInventory } = storeToRefs(useInventoryStore())
  const { products } = storeToRefs(useProductStore())
  const { replenishmentComponents, replenishmentProducts } = storeToRefs(useReplenishmentStore())
  const { skuProcedures } = storeToRefs(useShippingStore())

  const fbaData = computed(() => {
    return replenishmentProducts.value.map((replenishmentProduct) => {
      const amazonData = amazonInventory.value[replenishmentProduct.sku]
      const shippingData = skuProcedures.value[replenishmentProduct.sku]

      return {
        amazon: {
          dimensions: amazonData?.dimensions,
        },
        replenishment: {
          quantity: replenishmentProduct.replenishmentQuantity,
          quantity_per_case: replenishmentProduct.quantityPerCase,
        },
        shipping: {
          current: shippingData.shipping.current,
        },
        sku: replenishmentProduct.sku,
      }
    })
  })

  const poData = computed(() => {
    return Object.entries(replenishmentComponents).map(([componentSku, component]) => {
      const productData = products.value.find((product) => product.sku === componentSku)

      return {
        allocated: component.allocated,
        sku: componentSku,
        supplier: productData.supplier,
      }
    })
  })

  return { fbaData, poData }
}
