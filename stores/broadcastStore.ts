import { defineStore } from "pinia"

type BroadcastState = {
    current_step: number;
    completed_steps: number;
    broadcast_id: NumberOrNull;
    broadcast_data: BroadcastData;
    draft_to_save: DraftToSave;
    first_step_data: FirstStepData;
    second_step_data: SecondStepData;
    third_step_data: null;
    error: { step_error: string, message: string } | null;
    toast_error: { state: boolean, message: string };
    is_saving_draft: boolean;
    is_loading_draft: boolean;
    has_loaded_draft: boolean;
};

type BroadcastActions = {
    goPrevStep: () => void;
    goNextStep: () => void;
    goToStep: (step: number) => void;
    resetBroascast: () => void;
    validateSteps: () => boolean;
    validateFirstStep: () => boolean;
    validateSecondStep: () => boolean;
    clearErrorMessage: () => void;
    prepare_data_to_save: () => void;
    save_step_draft: () => void;
    loadLastDraft: (broadcast_id: number) => void;
}

export const useBroadcastStore = defineStore<"BroadcastStore", BroadcastState, {}, BroadcastActions>("BroadcastStore", {
    state: (): BroadcastState => {
        return {
            current_step: 1,
            completed_steps: 1,
            broadcast_id: null,
            broadcast_data: {
                first_step_data: null,
                second_step_data: null,
                third_step_data: null,
            },
            draft_to_save: { broadcast_id: null, draft_step: 1, draft_data: null },
            first_step_data: { name: '', broadcast_advanced: [] },
            second_step_data: { start_time_selected: null, start_time: null },
            third_step_data: null,
            error: null,
            toast_error: { state: false, message: '' },
            is_saving_draft: false,
            is_loading_draft: false,
            has_loaded_draft: false,
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
            if (this.current_step >= 5 || !this.validateSteps()) return
            this.prepare_data_to_save();
            const draft_ok = await this.save_step_draft();
            if(!draft_ok) return
            this.current_step++;
            if (this.current_step > this.completed_steps) this.completed_steps = this.current_step;
        },
        async goToStep(step: number) { // To navigate when a step is clicked
            if(step === this.current_step) return
            if(step > this.current_step) { // Validate and save only when navigating forward
                if(!this.validateSteps()) return
                this.prepare_data_to_save();
                const draft_ok = await this.save_step_draft();
                if(!draft_ok) return
            }
            this.current_step = step;
        },
        resetBroascast() { // To reset the broadcast form
            this.current_step = 1;
            this.completed_steps = 1;
            this.broadcast_data = {
                first_step_data: null,
                second_step_data: null,
                third_step_data: null,
            }
            this.draft_to_save = { broadcast_id: null, draft_step: 1, draft_data: null };
            this.first_step_data = { name: '', broadcast_advanced: [] };
            this.second_step_data = { start_time_selected: null, start_time: null };
            this.third_step_data = null;
            this.error = null;
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

            if (this.first_step_data.name === '') {
                isValid = false;
                this.error = { step_error: 'title', message: 'Broadcast name is mandatory' };
                return isValid;
            }
            if(this.first_step_data.name.length > 40) {
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
        prepare_data_to_save() { // Assign the current step data to the draft broadcast to save
            this.draft_to_save.broadcast_id = this.broadcast_id;
            this.draft_to_save.draft_step = this.current_step;
            switch (this.current_step) {
                case 1:
                    this.broadcast_data.first_step_data = this.first_step_data;
                    this.draft_to_save.draft_data = this.first_step_data;
                    break;
                case 2:
                    this.broadcast_data.second_step_data = this.second_step_data;
                    this.draft_to_save.draft_data = this.second_step_data;
                    break;
                default:
                    break;
            }
        },
        async save_step_draft(): Promise<false | number> {
            this.is_saving_draft = true;
            const response = await saveBroadcastDraft(this.draft_to_save);
            this.is_saving_draft = false
            if(!response.result) {
                this.toast_error = { state: true, message: 'There was an error saving the draft, please try again.' }; // To activate the toast error message
                setTimeout(() => this.toast_error = { state: false, message: '' }, 500);
                return false
            }
            this.broadcast_id = response.draft_id;
            return response.draft_id
        },
        async loadLastDraft(broadcast_id): Promise<void> {
            const data = { broadcast_id };
            this.is_loading_draft = true;
            const response = await getBroadcast(data)
            this.is_loading_draft = false;

            if(!response.result || response.broadcast_data === null) {
                this.toast_error = { state: true, message: 'Something failed while loading the draft' };
                setTimeout(() => this.toast_error = { state: false, message: '' }, 500);
                return
            }
            this.has_loaded_draft = true;
            const { broadcast } = response.broadcast_data;
            this.broadcast_id = broadcast.id
            this.current_step = Number(broadcast.draft_step);
            this.completed_steps = broadcast.draft_step;

            this.first_step_data.name = broadcast.name;
            this.broadcast_data.first_step_data = this.first_step_data;
            //TODO: Need to check and load the advanced data too

            if(broadcast.draft_step > 1) {
                if(broadcast.start_time) {
                    this.second_step_data.start_time_selected = 'another';
                    this.second_step_data.start_time = broadcast.start_time;
                } else {
                    this.second_step_data.start_time_selected = 'now';
                    this.second_step_data.start_time = null;
                }
                this.broadcast_data.second_step_data = this.second_step_data;
            }
        }
    }
})