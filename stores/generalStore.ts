import { defineStore } from "pinia"

interface GeneralState {
  timezones: Timezone[];
  area_codes: AreaCodes[];
  user_timezone: Timezone | null;
  is_navbar_collapsed: boolean;
}

interface GeneralActions {
  getUserAreaCodesAndTimezonesData: () => Promise<void>;
  getUserTimezone: () => Promise<void>;
  toggleCollapseNavbar: () => void;
}

export const useGeneralStore = defineStore<"GeneralStore", GeneralState, {}, GeneralActions>("GeneralStore", {
  state: (): GeneralState => {
    return {
      timezones: [
        { zones_id: "1", country_initials: "CA", zone: "America/Moncton", offset: "GMT-03:00", display: "Atlantic Time (Canada)" },
        { zones_id: "2", country_initials: "US", zone: "America/New_York", offset: "GMT-04:00", display: "Eastern Time Zone (US & Canada)" },
        { zones_id: "3", country_initials: "US", zone: "America/Chicago", offset: "GMT-05:00", display: "Central Time Zone (US & Canada)" },
        { zones_id: "4", country_initials: "CA", zone: "America/Edmonton", offset: "GMT-06:00", display: "Mountain Time (US & Canada)" },
        { zones_id: "5", country_initials: "US", zone: "America/Los_Angeles", offset: "GMT-07:00", display: "Arizona" },
        { zones_id: "6", country_initials: "US", zone: "America/Los_Angeles", offset: "GMT-07:00", display: "Pacific Time (US & Canada)" },
        { zones_id: "7", country_initials: "US", zone: "America/Anchorage", offset: "GMT-08:00", display: "Alaska" },
        { zones_id: "8", country_initials: "US", zone: "America/Adak", offset: "GMT-09:00", display: "Hawaii" },
        { zones_id: "9", country_initials: "UK", zone: "Europe/London", offset: "GMT+01:00", display: "United Kingdom" }
      ],
      area_codes: JSON.parse(localStorage.getItem("area_codes") ?? "{}"),
      user_timezone: null,
      is_navbar_collapsed: false 
    }
  },
  actions: {
    async getUserAreaCodesAndTimezonesData():Promise<void>{
      const response = await getUserGeneral()  
      if(response.result) {
        this.timezones  = response.timezones,        
        this.area_codes = response.area_codes
        localStorage.setItem("area_codes", JSON.stringify(response.area_codes))
      }
    },
    async getUserTimezone():Promise<void>{
      const response = await getUserTimezone()  
      if(response.result) {
        this.user_timezone  = response.user_timezone
      }
    },
    toggleCollapseNavbar(): void {
      this.is_navbar_collapsed = !this.is_navbar_collapsed
    }
  },
})