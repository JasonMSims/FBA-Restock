import { googleAppsScriptService } from '@/js/services'

export const userService = {
  fetchUserPreferences: async () => {
    try {
      const response = await googleAppsScriptService.runGoogleScript({
        serverFunctionName: 'get_user_property',
        params: ['user_preferences'],
      })
      return response
    } catch (error) {
      console.error(`Error fetching user preferences:`, error)
      throw new Error(`Failed to fetch user preferences`)
    }
  },
  updateUserPreferences: async (userPreferences, merge = false) => {
    try {
      const response = await googleAppsScriptService.setUserProperty({
        property: 'user_preferences',
        value: userPreferences,
        merge,
      })
      return response
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw new Error('Failed to update user preferences')
    }
  },
}
