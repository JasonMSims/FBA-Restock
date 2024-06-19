import { googleAppsScriptService } from '@/js/services'

export const marketplaceService = {
  fetchMarketplaces: async () => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_marketplaces',
      })
      return response
    } catch (error) {
      console.error(`Error fetching marketplaces:`, error)
      throw new Error(`Failed to fetch marketplaces`)
    }
  },
}
