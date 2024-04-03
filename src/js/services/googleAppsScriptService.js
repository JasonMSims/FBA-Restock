import { mockRunGoogleScript } from './mock/mockRunGoogleScript'

export const googleAppsScriptService = {
  runGoogleScript: async ({ serverFunctionName, params = [] }) => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return mockRunGoogleScript({ serverFunctionName, params })
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

  setProperty: async ({ propertyType, property, value, merge = true }) => {
    if (typeof value !== 'object') {
      value = [value] // Ensure value is always an object or an array
    }

    try {
      return await googleAppsScriptService.runGoogleScript({
        serverFunctionName: propertyType,
        params: [{ property, value }, merge],
      })
    } catch (error) {
      console.error(`Error in setProperty (${propertyType}):`, error)
      throw error
    }
  },

  setScriptProperty: async (args) => googleAppsScriptService.setProperty({ propertyType: 'set_script_property', ...args }),
  setUserProperty: async (args) => googleAppsScriptService.setProperty({ propertyType: 'set_user_property', ...args }),

  fetchScriptProperties: async (propertyNames) => {
    try {
      return await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_script_properties',
        params: [propertyNames],
      })
    } catch (error) {
      console.error(`Error in fetchScriptProperties:`, error)
      throw error
    }
  },
}

export default googleAppsScriptService
