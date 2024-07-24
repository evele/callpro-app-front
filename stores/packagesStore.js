import { defineStore } from "pinia"

export const usePackagesStore = defineStore("PackagesStore", {
  state: () => {
    return {
        packages_steps: []
    }
  },
  actions: {
    async getPackagesSteps() {
      const response = await fetchWrapper.get(GET_PACKAGE_STEPS_URL)    
      if(response.result) {
        this.packages_steps = response.steps
      }
    },
  },
})