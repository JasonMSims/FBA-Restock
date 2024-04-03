import { googleAppsScriptService } from '@/js/services'

export const warehouseService = {
  fetchWarehouses: async () => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_skuvault_warehouses',
      })
      return response
    } catch (error) {
      console.error(`Error fetching warehouses:`, error)
      throw new Error(`Failed to fetch warehouses`)
    }
  },
}
