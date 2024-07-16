import { defineStore } from "pinia"

export const useAudiosStore = defineStore("AudiosStore", {
  state: () => {
    return {
        audios: {},
        has_older_audios: false
    }
  },
  actions: {
    async loadAudios(show_all) {
      const data = { show_all_audios: show_all }
      const response = await fetchWrapper.post(LOAD_AUDIOS_URL, data)    
      if(response.result) {
        this.audios = response.audios,
        this.has_older_audios = response.has_older_audios
      }
    },
  },
})