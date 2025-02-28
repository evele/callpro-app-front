import { defineStore } from "pinia"

type BillingState = {
  selected_step: FormattedStep | null;
  selected_plan: MonthlyGroupPlan | null;
};

export const useBillingStore = defineStore("BillingStore", {
  state: (): BillingState => {
    return {
      selected_step: null,
      selected_plan: null
    }
  },
  actions: {
    selectUnselectStep(step: FormattedStep) {
      if(this.selected_step?.id === step.id) {
        this.selected_step = null;
        return;
      }
      this.selected_step = step;
      this.selected_plan = null;
    },
    selectUnselectPlan(plan: MonthlyGroupPlan) {
      if(this.selected_plan?.id === plan.id) {
        this.selected_plan = null;
        return;
      }
      this.selected_plan = plan;
      this.selected_step = null;
    }
  }
})