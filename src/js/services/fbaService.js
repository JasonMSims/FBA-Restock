import { googleAppsScriptService } from '@/js/services'

export const fbaService = {
  createStaWorkflow: async (fbaData) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'create_sta_workflow',
        params: [fbaData],
      })
      return response
    } catch (error) {
      console.error(`Error creating STA workflow:`, error)
      throw new Error(`Failed to create STA workflow`)
    }
  },
  createFba: async (fbaData) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'create_fba',
        params: [fbaData],
      })
      return response
    } catch (error) {
      console.error(`Error creating FBA:`, error)
      throw new Error(`Failed to create FBA`)
    }
  },
  createIndividualFbas: async (fbaData) => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'create_individual_fbas',
        params: [fbaData],
      })
      return response
    } catch (error) {
      console.error(`Error creating individual FBAs:`, error)
      throw new Error(`Failed to create individual FBAs`)
    }
  },
}
