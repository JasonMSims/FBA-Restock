import { googleAppsScriptService } from '@/js/services'

export const inventoryService = {
  fetchAmazonInventory: async () => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_fba_inventory',
      })
      return response
    } catch (error) {
      console.error(`Error fetching Amazon inventory:`, error)
      throw new Error(`Failed to fetch Amazon inventory`)
    }
  },
}
