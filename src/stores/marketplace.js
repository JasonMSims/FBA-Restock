import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { useUserStore } from './user'
import { marketplaceService } from '@/js/services'

export const useMarketplaceStore = defineStore('marketplace', () => {
  const activeMarketplaces = ['US', 'CA']
  const userStore = useUserStore()

  const marketplaces = ref({})
  const marketplaceCodes = computed(() => Object.keys(marketplaces.value).sort())
  const marketplaceCode = computed({
    get: () => userStore.userPreferences.marketplaceCode,
    set: (value) => userStore.setUserPreferences({ marketplaceCode: value }),
  })
  const marketplace = computed(() => marketplaces.value[marketplaceCode.value] || {})
  const marketplacesLoading = ref(false)

  async function fetchMarketplaces() {
    try {
      marketplacesLoading.value = true
      const fetchedMarketplaces = await marketplaceService.fetchMarketplaces()
      marketplaces.value = Object.keys(fetchedMarketplaces).reduce((obj, key) => {
        if (activeMarketplaces.includes(key)) {
          obj[key] = fetchedMarketplaces[key]
        }
        return obj
      }, {})
    } catch (error) {
      console.error(`Failed to fetch marketplaces:`, error)
    } finally {
      // await nextTick()
      marketplacesLoading.value = false
    }
  }

  fetchMarketplaces()

  return { marketplace, marketplaceCode, marketplaces, marketplaceCodes, marketplacesLoading }
})
