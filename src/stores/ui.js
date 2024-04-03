import { defineStore } from 'pinia'
import { ref, toRefs } from 'vue'

import { useAlertStore } from './alert'
import { useUserStore } from './user'

export const useUIStore = defineStore('ui', () => {
  const alertStore = useAlertStore()
  const userStore = useUserStore()

  const sidebarOpen = ref(false)

  const { runRate, tablePagination, targetDays } = toRefs(userStore.userPreferences)
  const sku = ref('')
  const blacklistOnly = ref(false)
  const dropshipOnly = ref(false)
  const favoriteOnly = ref(false)
  const selectedOnly = ref(false)
  const productSize = ref('all')
  const alerts = ref(Object.values(alertStore.alerts))

  return {
    alerts,
    blacklistOnly,
    dropshipOnly,
    favoriteOnly,
    productSize,
    runRate,
    selectedOnly,
    sidebarOpen,
    sku,
    tablePagination,
    targetDays,
  }
})
