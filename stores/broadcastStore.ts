import { defineStore } from "pinia"

type FirstStepData = {
    broadcast_name: string;
    broadcast_advanced: string[]; // isn't the correct type, but for now...
}

type SecondStepData = {
    start_time_selected: 'now' | 'another' | null;
    start_time: string | null;
}

type BroadcastState = {
    current_step: number;
    completed_steps: number;
    first_step_data: FirstStepData;
    second_step_data: SecondStepData;
    broadcast_info: string | null;
    error: { step_error: string, message: string } | null;
};

type BroadcastActions = {
    resetBroascast(): void;
}

export const useBroadcastStore = defineStore<"BroadcastStore", BroadcastState, {}, BroadcastActions>("BroadcastStore", {
    state: (): BroadcastState => {
        return {
            current_step: 1,
            completed_steps: 1,
            first_step_data: {  broadcast_name: '', broadcast_advanced: [] },
            second_step_data: { start_time_selected: null, start_time: null },
            broadcast_info: null,
            error: null
        }
    },
    actions: {
        goPrevStep() { // To navigate when previous button is clicked
            if (this.current_step > 1) {
                this.clearErrorMessage();
                this.current_step--;
            }
        },
        async goNextStep() { // To navigate when next button is clicked
            if (!this.validateSteps()) return
            if (this.current_step < 5)  {
                await this.save_step_draft();
                this.current_step++;
            }
            if (this.current_step > this.completed_steps) this.completed_steps = this.current_step;

        },
        goToStep(step: number) { // To navigate when a step is clicked
            if(step === this.current_step) return
            if(step > this.current_step && !this.validateSteps()) return
            this.current_step = step;
        },
        resetBroascast() { // To reset the broadcast form
            this.broadcast_info = null;
        },
        validateSteps() { // To validate the form data when navigating between steps
            switch (this.current_step) {
                case 1:
                    return this.validateFirstStep();
                case 2:
                    return this.validateSecondStep();
                default:
                    break;
            }
        },
        validateFirstStep() {
            let isValid = true;

            if (this.first_step_data.broadcast_name === '') {
                isValid = false;
                this.error = { step_error: 'title', message: 'Broadcast name is mandatory' };
                return isValid;
            }
            if(this.first_step_data.broadcast_name.length > 40) {
                isValid = false;
                this.error_message = { step_error: 'title', message: 'Broadcast name should not be more than 40 characters' };
                return isValid;
            }

            this.clearErrorMessage();
            return isValid;
        },
        validateSecondStep() {
            let isValid = true;

            if (
                this.second_step_data.start_time_selected === null ||
                (this.second_step_data.start_time_selected === 'another' && this.second_step_data.start_time === null)
            ) {
                isValid = false;
                this.error_message = { step_error: 'time', message: 'Start date is mandatory' };
                return isValid;
            }

            this.clearErrorMessage();
            return isValid;
        },
        clearErrorMessage() {
            this.error_message = null;
        },
        async save_step_draft() {
            // TODO: CONTINUE HERE
            switch (this.current_step) {
                case 1:
                    return this.save_first_step_daft();
                default:
                    break;
            }
        },
        async save_first_step_daft() {
            // TODO: CONTINUE HERE
        }
    }
})