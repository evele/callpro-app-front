import { defineStore } from "pinia"

export const useAudiosStore = defineStore("AudiosStore", {
  state: () => {
    return {
        audios: {},
        older_audios: false
    }
  },
  actions: {
    async loadAudios(data) {
      const response = await fetchWrapper.post(LOAD_AUDIOS_URL, data)    
      if(response.result) {
        this.audios = response.audios,
        this.older_audios = response.older_audios
      }
    },
  },
})