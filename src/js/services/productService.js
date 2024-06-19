import { googleAppsScriptService } from './googleAppsScriptService'

export const productService = {
  fetchProductsAndKits: async () => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_products_and_kits',
      })
      return response
    } catch (error) {
      console.error(`Error fetching products and kits:`, error)
      throw new Error(`Failed to fetch products and kits`)
    }
  },
}
