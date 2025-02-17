import { defineStore } from "pinia"

type AudiosState = {
  audio_playing: Audio | null;
  from_modal: boolean;
};

export const useAudiosStore = defineStore("AudiosStore", {
  state: (): AudiosState => {
    return {
      audio_playing: null,
      from_modal: false
    }
  },
})