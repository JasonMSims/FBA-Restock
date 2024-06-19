import { googleAppsScriptService } from '@/js/services'

export const classificationService = {
  fetchClassifications: async (properties) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_script_properties',
        params: [properties],
      })
      return response
    } catch (error) {
      console.error(`Error fetching classifications:`, error)
      throw new Error(`Failed to fetch classifications`)
    }
  },
  setClassification: async (classification) => {
    try {
      const response = await googleAppsScriptService.setScriptProperty(classification)
      return response
    } catch (error) {
      console.error('Error setting classification:', error)
      throw new Error('Failed to update classification')
    }
  },
}
