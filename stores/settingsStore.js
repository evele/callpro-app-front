import { defineStore } from "pinia"

export const useSettingsStore = defineStore("SettingsStore", {
  state: () => {
    return {
        settings_data: {}
    }
  },
  actions: {
    async getSettingsData() {
      const response = await fetchWrapper.get(GET_SETTINGS_DATA_URL)    
      if(response.result) {
        this.settings_data = response.settings
      }
    },
  },
})
