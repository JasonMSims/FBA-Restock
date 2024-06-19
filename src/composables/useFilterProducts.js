import { storeToRefs } from 'pinia'
import { computed, toRefs } from 'vue'

import { useClassificationStore, useInventoryStore, useProductStore, useReplenishmentStore, useUIStore } from '../stores'
import { useGetContainingKits } from './useGetContainingKits'

export const useFilterProducts = () => {
  const {
    blacklist: blacklistSkus,
    dropship: dropshipSkus,
    favorite: favoriteSkus,
    oversize: oversizeSkus,
  } = toRefs(useClassificationStore().classifications)

  const { amazonInventory } = storeToRefs(useInventoryStore())
  const { kits, products } = storeToRefs(useProductStore())
  const { replenishmentProducts } = storeToRefs(useReplenishmentStore())
  const { blacklistOnly, dropshipOnly, favoriteOnly, productSize, selectedOnly, sku: skuFilter } = storeToRefs(useUIStore())

  return computed(() => {
    const containingKits = useGetContainingKits(skuFilter.value, kits.value)
    const replenishmentSkus = new Set([...replenishmentProducts.value.keys()])
    const sizeFilter = {
      all: () => true,
      oversize: (product) => oversizeSkus.value.includes(product.sku),
      standard: (product) => !oversizeSkus.value.includes(product.sku),
    }[productSize.value]

    return products.value.filter((product) => {
      const isInAmazonInventory = amazonInventory.value[product.sku]
      const matchesSearchTerm = product.sku.match(new RegExp(skuFilter.value.toUpperCase(), 'i')) || containingKits.includes(product.sku)
      const matchesFavorite = !favoriteOnly.value || favoriteSkus.value.includes(product.sku)
      const matchesDropship = !dropshipOnly.value || dropshipSkus.value.includes(product.sku)
      const matchesBlacklist = blacklistOnly.value ? blacklistSkus.value.includes(product.sku) : !blacklistSkus.value.includes(product.sku)
      const matchesSize = sizeFilter(product)
      const isSelected = !selectedOnly.value || replenishmentSkus.has(product.sku)

      return isInAmazonInventory && matchesSearchTerm && matchesFavorite && matchesDropship && matchesBlacklist && matchesSize && isSelected
    })
  })
}
