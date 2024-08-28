import { defineStore } from "pinia"

export const usePackagesStore = defineStore("PackagesStore", {
  state: () => {
    return {
        packages_steps: [],
        monthly_groups_plans: [],        
    }
  },
  actions: {
    async getPackagesSteps() {
      const response = await fetchWrapper.get(GET_PACKAGE_STEPS_URL)    
      if(response.result) {
        this.packages_steps = response.steps
      }
    },
    async getMonthlyGroupsPlans() {
      const response = await fetchWrapper.get(GET_MONTHLY_GROUPS_PLANS_URL)    
      if(response.result) {
        this.monthly_groups_plans = response.monthly_groups_plans
      }
    },
  },

})