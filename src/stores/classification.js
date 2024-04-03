import { defineStore } from 'pinia'
import { ref, reactive, watch, nextTick } from 'vue'
import { classificationService } from '../js/services'

export const useClassificationStore = defineStore('classification', () => {
  const classifications = reactive({
    blacklist: [],
    canada: [],
    dropship: [],
    favorite: [],
    fbm: [],
    oversize: [],
  })
  const classificationsLoading = ref(false)

  const mapClassificationToPropertyName = (classificationName) => {
    return `${classificationName}_skus`
  }

  const mapPropertyNameToClassification = (propertyName) => {
    return propertyName.replace('_skus', '')
  }

  Object.keys(classifications).forEach((key) => {
    watch(
      () => classifications[key],
      async (newValue, oldValue) => {
        if (!classificationsLoading.value) {
          if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
            const propertyName = mapClassificationToPropertyName(key)
            await classificationService.setClassification({ property: propertyName, value: newValue })
          }
        }
      },
      { deep: true }
    )
  })

  const fetchClassifications = async () => {
    try {
      classificationsLoading.value = true
      const propertyNames = Object.keys(classifications).map(mapClassificationToPropertyName)
      const fetchedClassifications = await classificationService.fetchClassifications(propertyNames)
      Object.entries(fetchedClassifications).forEach(([legacyKey, value]) => {
        const newKey = mapPropertyNameToClassification(legacyKey)
        if (newKey) {
          classifications[newKey] = value
        }
      })
    } catch (error) {
      console.error(`Failed to fetch classifications:`, error)
    } finally {
      // await nextTick()
      classificationsLoading.value = false
    }
  }

  const toggleSkuClassification = (classificationName, skus) => {
    let updatedClassification = [...classifications[classificationName]]
    skus = Array.isArray(skus) ? skus : [skus] // If a string is passed for 'skus', wrap it in an array
    skus.forEach((sku) => {
      const index = updatedClassification.indexOf(sku)
      if (index === -1) {
        updatedClassification.push(sku) // Add the SKU if not present
      } else {
        updatedClassification.splice(index, 1) // Remove the SKU if present
      }
    })
    classifications[classificationName] = updatedClassification
  }

  // Fetch classifications as soon as the Store is initialized
  fetchClassifications()

  return {
    classifications,
    fetchClassifications,
    classificationsLoading,
    toggleSkuClassification,
  }
})
