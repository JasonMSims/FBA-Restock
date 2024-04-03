import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useReplenishmentStore, useUIStore } from '../stores'
import { useFilterProducts, useIntegrateAmazonData, useIntegrateShippingData } from './'

export const useSkuTable = () => {
  const { productsLoading } = storeToRefs(useReplenishmentStore())
  // const { getAllocatableQuantity } = useReplenishmentStore()
  const { alerts: activeAlerts } = storeToRefs(useUIStore())

  const filteredProducts = useFilterProducts()
  const skuTableData = computed(() => {
    let data = useIntegrateAmazonData(filteredProducts.value)

    data = data.filter((product) => {
      const productAlertMessage = product.onHandAlert.message
      return activeAlerts.value.some((alert) => alert.message === productAlertMessage)
    })
    data = useIntegrateShippingData(data)

    return data
    // return data.map((product) => ({
    //   ...product,
    //   warehouse: {
    //     ...product.warehouse,
    //     inventory: {
    //       ...product.warehouse.inventory,
    //       allocatable: getAllocatableQuantity(product.sku),
    //     },
    //   },
    // }))
  })

  const skuTableDataLoading = computed(() => {
    return productsLoading.value
  })

  return { skuTableData, skuTableDataLoading }
}
