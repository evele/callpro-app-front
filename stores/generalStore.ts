import { defineStore } from "pinia"

interface GeneralState {
  timezones: Timezone[];
  area_codes: AreaCodes[];
}

export const useGeneralStore = defineStore("GeneralStore", {
  state: ():GeneralState => {
    return {
      timezones: JSON.parse(localStorage.getItem("timezones") ?? "{}"),
      area_codes: JSON.parse(localStorage.getItem("area_codes") ?? "{}")       
    }
  },
  actions: {
    async getUserAreaCodesAndTimezonesData():Promise<void>{
      const response = await getUserGeneral()  
      if(response.result) {
        this.timezones  = response.timezones,
        localStorage.setItem("timezones", JSON.stringify(response.timezones))
        this.area_codes = response.area_codes
        localStorage.setItem("area_codes", JSON.stringify(response.area_codes))
      }
    }
  },
})