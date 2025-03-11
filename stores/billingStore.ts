import { defineStore } from "pinia"

type BillingState = {
  selected_step: FormattedStep | null;
  selected_plan: MonthlyGroupPlan | null;
  reference_step_id: string | null;
  recap_data: RecapData;
};

type BillingActions = {
  selectUnselectStep(step: FormattedStep | null): void;
  selectUnselectPlan(plan: MonthlyGroupPlan): void;
  setReferenceStepId(id: string | null): void;
  setRecapData(data: RecapData | null): void;
  resetStore(): void;
}

const emptyRecapData = {
  pack_info: 0,
  discount: 0,
  subtotal: 0,
  total: 0
}

export const useBillingStore = defineStore<"BillingStore", BillingState, {}, BillingActions>("BillingStore", {
  state: (): BillingState => {
    return {
      selected_step: null,
      selected_plan: null,
      reference_step_id: null,
      recap_data: emptyRecapData
    }
  },
  actions: {
    selectUnselectStep(step: FormattedStep | null) {
      if(!step || this.selected_step?.id === step.id) {
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
    },
    setReferenceStepId(id: string | null) {
      this.reference_step_id = id
      if(id !== null) {
        this.selected_step = null;
        this.selected_plan = null;
      }
    },
    setRecapData(data: RecapData | null) {
      if(data === null) {
        this.recap_data = emptyRecapData
      } else {
        this.recap_data = data;
      }
    },
    resetStore() {
      this.selected_step = null;
      this.selected_plan = null;
      this.reference_step_id = null;
      this.recap_data = emptyRecapData
    }
  }
})