import { mockRunGoogleScript } from './mock/mockRunGoogleScript'

export const googleAppsScriptService = {
  fetchScriptProperties: async (propertyNames) => {
    try {
      return await googleAppsScriptService.runGoogleScript({
        params: [propertyNames],
        serverFunctionName: 'get_script_properties',
      })
    } catch (error) {
      console.error('Error in fetchScriptProperties:', error)
      throw error
    }
  },

  runGoogleScript: async ({ params = [], serverFunctionName }) => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return mockRunGoogleScript({ params, serverFunctionName })
    } else {
      try {
        return await new Promise((resolve, reject) => {
          google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            [serverFunctionName](...params)
        })
      } catch (error) {
        console.error(`Error calling server function ${serverFunctionName}:`, error)
        throw error
      }
    }
  },

  setProperty: async ({ merge = true, property, propertyType, value }) => {
    if (typeof value !== 'object') {
      value = [value] // Ensure value is always an object or an array
    }

    try {
      return await googleAppsScriptService.runGoogleScript({
        params: [{ property, value }, merge],
        serverFunctionName: propertyType,
      })
    } catch (error) {
      console.error(`Error in setProperty (${propertyType}):`, error)
      throw error
    }
  },
  setScriptProperty: async (args) => googleAppsScriptService.setProperty({ propertyType: 'set_script_property', ...args }),

  setUserProperty: async (args) => googleAppsScriptService.setProperty({ propertyType: 'set_user_property', ...args }),
}
