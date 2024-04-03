export const useAmazonInventory = () => {
  const getSellableAmazonInventory = (productAmazonInventory, includedStatuses) => {
    // Calculate the sellable quantity of a product
    return Object.entries(productAmazonInventory).reduce((a, c) => {
      // Reduce the Amazon `inventory` of the product and return the total of all inventory statuses that are in the `includedInventoryStatuses `array
      return includedStatuses.includes(c[0]) ? a + parseInt(c[1]) : a
    }, 0)
  }

  const getAmazonUnitsSold = (amazonData, runRateType) => {
    return {
      '7d': amazonData.units_sold[runRateType]['7d'],
      '30d': amazonData.units_sold[runRateType]['30d'],
    }
  }

  const getRunRate = (unitsSold, runRateDuration) => {
    const dailyRate = {
      '7d': unitsSold['7d'] / 7,
      '30d': unitsSold['30d'] / 30,
    }
    return { ...dailyRate, active: dailyRate[runRateDuration] }
  }

  const getDaysOnHand = (sellableInventory, runRate) => {
    return runRate > 0 ? Math.floor(sellableInventory / runRate) : sellableInventory > 0 ? Infinity : 0
  }

  const getReplenishmentRecommendation = (sellableInventory, productRunRate, targetDays, runRateDuration) => {
    const recommendation = {
      '7d': Math.ceil(productRunRate['7d'] * targetDays - sellableInventory),
      '30d': Math.ceil(productRunRate['30d'] * targetDays - sellableInventory),
    }
    return { ...recommendation, active: recommendation[runRateDuration] }
  }

  const getOnHandAlert = ({ alerts, allocatableInventory, daysOnHand, inboundInventory, targetDays, unitsSold, workingInventory }) => {
    // Calculate the on hand alert message based on the inventory level and status of inbound inventory
    if (inboundInventory || workingInventory) return alerts.inboundFba
    else if (allocatableInventory <= 0) return alerts.noLocal
    else if (unitsSold['30d'] === 0) return alerts.noSales
    else if (daysOnHand >= targetDays * 0.8) {
      if (daysOnHand < targetDays) {
        return alerts.moderateFba
      } else {
        return daysOnHand > targetDays * 1.25 ? alerts.excessFba : alerts.optimalFba
      }
    } else {
      return alerts.lowFba
    }
  }

  return {
    getAmazonUnitsSold,
    getDaysOnHand,
    getOnHandAlert,
    getReplenishmentRecommendation,
    getRunRate,
    getSellableAmazonInventory,
  }
}
