import { defineStore } from "pinia"

type FirstStepData = {
    broadcast_name: string;
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
    error_message: string;
};

type BroadcastActions = {
    resetBroascast(): void;
}

export const useBroadcastStore = defineStore<"BroadcastStore", BroadcastState, {}, BroadcastActions>("BroadcastStore", {
    state: (): BroadcastState => {
        return {
            current_step: 1,
            completed_steps: 1,
            first_step_data: {  broadcast_name: '' },
            second_step_data: { start_time_selected: null, start_time: null },
            broadcast_info: null,
            error_message: ''
        }
    },
    actions: {
        goPrevStep() {
            if (this.current_step > 1) {
                this.clearErrorMessage();
                this.current_step--;
            }
        },
        goNextStep() {
            if (!this.validateSteps()) return
            if (this.current_step < 5) this.current_step++;
            if (this.current_step > this.completed_steps) this.completed_steps = this.current_step;

        },
        goToStep(step: number) {
            if(step === this.current_step) return
            if(step > this.current_step && !this.validateSteps()) return
            this.current_step = step;
        },
        resetBroascast() {
            this.broadcast_info = null;
        },
        validateSteps() {
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
                this.error_message = 'Broadcast name is mandatory';
                return isValid;
            }
            if(this.first_step_data.broadcast_name.length > 40) {
                isValid = false;
                this.error_message = 'Broadcast name should not be more than 40 characters';
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
                this.error_message = 'Start date is mandatory';
                return isValid;
            }

            this.clearErrorMessage();
            return isValid;
        },
        clearErrorMessage() {
            this.error_message = '';
        }
    }
})