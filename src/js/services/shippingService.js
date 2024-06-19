import { googleAppsScriptService } from '@/js/services'

export const shippingService = {
  fetchSkuProcedures: async () => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_sku_procedure',
      })
      return response
    } catch (error) {
      console.error(`Error fetching SKU procedures:`, error)
      throw new Error(`Failed to fetch SKU procedures`)
    }
  },
}
