import { useAmazonInventory } from '@/composables'
import { useAlertStore, useInventoryStore, useSettingsStore, useUIStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const useIntegrateAmazonData = (products) => {
  const { alerts } = storeToRefs(useAlertStore())
  const { amazonInventory } = storeToRefs(useInventoryStore())
  const { includedInventoryStatuses } = storeToRefs(useSettingsStore())
  const { runRate, targetDays } = storeToRefs(useUIStore())

  const { getAmazonUnitsSold, getDaysOnHand, getOnHandAlert, getReplenishmentRecommendation, getRunRate, getSellableAmazonInventory } =
    useAmazonInventory()

  return products.map((product) => {
    const amazonData = amazonInventory.value[product.sku] || {}
    const inventoryData = amazonData.inventory || {}
    const inboundData = inventoryData.inbound || {}

    const workingInventory = inboundData.working || 0
    const inboundInventory = Object.values(inboundData).reduce((acc, value) => acc + (value || 0), 0) - workingInventory

    const enhancedAmazonInventory = { ...amazonData.inventory, inbound: inboundInventory, working: workingInventory }
    enhancedAmazonInventory.sellable = getSellableAmazonInventory(enhancedAmazonInventory, includedInventoryStatuses.value)

    const unitsSold = getAmazonUnitsSold(amazonData, runRate.value.type)
    const productRunRate = getRunRate(unitsSold, runRate.value.duration)
    const daysOnHand = getDaysOnHand(enhancedAmazonInventory.sellable, productRunRate.active)
    const replenishmentRecommendation = getReplenishmentRecommendation(
      enhancedAmazonInventory.sellable,
      productRunRate,
      targetDays.value,
      runRate.value.duration
    )
    const onHandAlert = getOnHandAlert({
      alerts: alerts.value,
      allocatableInventory: product.warehouse.inventory.allocatable,
      daysOnHand,
      inboundInventory: enhancedAmazonInventory.inbound,
      targetDays: targetDays.value,
      unitsSold,
      workingInventory: enhancedAmazonInventory.working,
    })

    return {
      ...product,
      amazon: {
        ...amazonData,
        inventory: {
          ...enhancedAmazonInventory,
        },
      },
      daysOnHand,
      onHandAlert,
      recommendation: replenishmentRecommendation,
      runRate: productRunRate,
      unitsSold,
    }
  })
}
