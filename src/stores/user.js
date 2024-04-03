import { defineStore } from 'pinia'
import { ref, reactive, watch, nextTick } from 'vue'
import { userService } from '@/js/services'
import { migrateKeys } from '@/js/utilities/migrationUtilities'

export const useUserStore = defineStore('user', () => {
  const userPreferences = reactive({
    targetDays: 65,
    marketplaceCode: 'US',
    runRate: {
      type: 'asin',
      duration: '7d',
    },
    tablePagination: {
      perPage: 50,
    },
  })
  const userPrefsLoading = ref(false)

  watch(
    () => userPreferences,
    (value) => {
      if (!userPrefsLoading.value) {
        console.log(`userPreferences changed`)
        userService.updateUserPreferences(value)
      }
    },
    { deep: true }
  )

  async function fetchUserPreferences() {
    try {
      userPrefsLoading.value = true
      const fetchedPreferences = await userService.fetchUserPreferences()
      const migratedPreferences = migrateKeys(fetchedPreferences)
      for (let preference in migratedPreferences) {
        userPreferences[preference] = migratedPreferences[preference]
      }
    } catch (error) {
      console.error(`Failed to fetch userPreferences:`, error)
    } finally {
      // await nextTick()
      userPrefsLoading.value = false
    }
  }

  function setUserPreferences(updatedPreferences) {
    for (let preference in updatedPreferences) {
      userPreferences[preference] = updatedPreferences[preference]
    }
  }

  // Fetch user preferences as soon as the Store is initialized
  fetchUserPreferences()

  return { userPreferences, fetchUserPreferences, setUserPreferences, userPrefsLoading }
})
