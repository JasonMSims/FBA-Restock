import { storeToRefs } from 'pinia'

import { useShippingStore } from '../stores'

export const useIntegrateShippingData = (products) => {
  const shippingStore = useShippingStore()
  const { defaultShipping, skuProcedures } = storeToRefs(shippingStore)

  return products.map((product) => {
    const productSkuProcedures = skuProcedures.value[product.sku]
    const {
      bundling,
      optimized_ship_quantity: optimizedShipQty = 1,
      shipping,
    } = productSkuProcedures || {
      optimized_ship_quantity: 1,
      shipping: {
        current: { ...defaultShipping.value },
        default: defaultShipping.value,
      },
    }

    return {
      ...product,
      bundling,
      optimizedShipQty,
      shipping,
    }
  })
}
