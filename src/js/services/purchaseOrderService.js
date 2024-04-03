import { googleAppsScriptService } from '@/js/services'

export const purchaseOrderService = {
  compileDraftPos: async (poData) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'compile_draft_purchase_orders',
        params: [poData],
      })
      return response
    } catch (error) {
      console.error(`Error compiling draft POs:`, error)
      throw new Error(`Failed to compile draft POs`)
    }
  },
  exportPos: async (params) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'export_purchase_order',
        params,
      })
      return response
    } catch (error) {
      console.error(`Error exporting POs:`, error)
      throw new Error(`Failed to export POs`)
    }
  },
  createPos: async (params) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'create_purchase_order',
        params,
      })
      return response
    } catch (error) {
      console.error(`Error creating POs:`, error)
      throw new Error(`Failed to create POs`)
    }
  },
}
