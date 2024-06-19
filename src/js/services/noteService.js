import { googleAppsScriptService } from '@/js/services'

export const noteService = {
  fetchSkuNotes: async () => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_script_property',
        params: ['sku_notes'],
      })
      return response
    } catch (error) {
      console.error(`Error fetching SKU notes:`, error)
      throw new Error(`Failed to fetch SKU notes`)
    }
  },
  updateSkuNotes: async (notes, merge = true) => {
    try {
      const response = await googleAppsScriptService.setScriptProperty({
        property: 'sku_notes',
        value: notes,
        merge,
      })
      return response
    } catch (error) {
      console.error('Error updating SKU notes:', error)
      throw new Error('Failed to update SKU notes')
    }
  },
}
