import { googleAppsScriptService } from '@/js/services'

export const fbaService = {
  createFba: async (fbaData) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        params: [fbaData],
        serverFunctionName: 'create_fba',
      })
      return response
    } catch (error) {
      console.error('Error creating FBA:', error)
      throw new Error('Failed to create FBA')
    }
  },
  createIndividualFbas: async (fbaData) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        params: [fbaData],
        serverFunctionName: 'create_individual_fbas',
      })
      return response
    } catch (error) {
      console.error('Error creating individual FBAs:', error)
      throw new Error('Failed to create individual FBAs')
    }
  },
  createStaWorkflow: async (fbaData) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        params: [fbaData],
        serverFunctionName: 'create_sta_workflow',
      })
      return response
    } catch (error) {
      console.error('Error creating STA workflow:', error)
      throw new Error('Failed to create STA workflow')
    }
  },
}
