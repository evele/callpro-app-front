import { defineStore } from "pinia"

export const useAudiosStore = defineStore("AudiosStore", {
  state: () => {
    return {
        audios: {},
        has_older_audios: false
    }
  },
  actions: {
    async getAudios(show_all) {
      const data = { show_all_audios: show_all }
      const response = await fetchWrapper.post(GET_AUDIOS_URL, data)    
      if(response.result) {
        this.audios = response.audios,
        this.has_older_audios = response.has_older_audios
      }
    },
    async getAudio(dataToSend) {
      const response = await fetchWrapper.post(GET_AUDIO_URL, dataToSend)
      return response
    },
    async convertTextToSpeech(dataToSend) {
      const response = await fetchWrapper.post(CONVERT_TEXT_TO_SPEECH_URL, dataToSend)
      return response
    },
  }
})