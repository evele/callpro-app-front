import { defineStore } from "pinia"

export const useSettingsStore = defineStore("SettingsStore", {
  state: () => {
    return {
        settings_data: {}
    }
  },
  actions: {
    async loadSettingsData() {
      const { data } = await fetchWrapper.get(LOAD_SETTINGS_DATA_URL)
      const response = toRaw(data.value)
      
      if(response.result) {
        this.settings_data = response.data
      }
    },
  },
})
