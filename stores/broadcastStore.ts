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
    is_saving_draft: { state: boolean, from : string };
    is_loading_draft: boolean;
    has_loaded_draft: boolean;
    is_resetting_draft: boolean;
    show_suggested_start: { show: boolean, suggested_start: string };
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
    prepareDataToSave: () => void;
    saveStepDraft: (from: 'step' | 'general') => Promise<false | number>;
    saveBroadcastDraft: () => Promise<boolean>;
    loadLastDraft: (broadcast_id: NumberOrNull) => void;
    deleteDraft: () => Promise<void>;
    checkStartTime: () => Promise<{ check: boolean | 'error', suggested_start?: string }>;
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
            draft_to_save: { broadcast_id: null, draft_step: 1, update_step: true, draft_data: null },
            first_step_data: { name: '', broadcast_advanced: [] },
            second_step_data: { start_time_selected: null, start_time: null },
            third_step_data: null,
            error: null,
            toast_error: { state: false, message: '' },
            is_saving_draft: { state: false, from : ''},
            is_loading_draft: false,
            has_loaded_draft: false,
            is_resetting_draft: false,
            show_suggested_start: { show: false, suggested_start: '' },
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
            this.prepareDataToSave();
            const draft_ok = await this.saveStepDraft('step');
            if(!draft_ok) return
            this.current_step++;
            if (this.current_step > this.completed_steps) this.completed_steps = this.current_step;
        },
        async goToStep(step: number) { // To navigate when a step is clicked
            if(step === this.current_step) return
            if(step > this.current_step) { // Validate and save only when navigating forward
                if(!this.validateSteps()) return
                this.prepareDataToSave();
                const draft_ok = await this.saveStepDraft('step');
                if(!draft_ok) return
            }
            this.current_step = step;
        },
        resetBroascast() { // To reset the broadcast form
            this.current_step = 1;
            this.completed_steps = 1;
            this.broadcast_id = null;
            this.broadcast_data = {
                first_step_data: null,
                second_step_data: null,
                third_step_data: null,
            }
            this.draft_to_save = { broadcast_id: null, draft_step: 1, update_step: true, draft_data: null };
            this.first_step_data = { name: '', broadcast_advanced: [] };
            this.second_step_data = { start_time_selected: null, start_time: null };
            this.third_step_data = null;
            this.error = null;
            this.show_suggested_start = { show: false, suggested_start: '' };
        },
        validateSteps() { // To validate the form data when navigating between steps
            switch (this.current_step) {
                case 1:
                    return this.validateFirstStep();
                case 2:
                    return this.validateSecondStep();
                default:
                    return true;
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
                this.error = { step_error: 'title', message: 'Broadcast name should not be more than 40 characters' };
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
                this.error = { step_error: 'time', message: 'Start date is mandatory' };
                return isValid;
            }

            this.clearErrorMessage();
            return isValid;
        },
        clearErrorMessage() {
            this.error = null;
        },
        prepareDataToSave() { // Assign the current step data to the draft broadcast to save
            this.draft_to_save.draft_data = null;
            this.draft_to_save.broadcast_id = this.broadcast_id;
            this.draft_to_save.draft_step = this.current_step;
            if(this.current_step < this.completed_steps) {
                this.draft_to_save.update_step = false
            }
            switch (this.current_step) {
                case 1:
                    this.broadcast_data.first_step_data = this.first_step_data;
                    this.draft_to_save.draft_data = this.first_step_data;
                    break;
                case 2:
                    if(this.second_step_data.start_time_selected === 'another') {
                        this.second_step_data.start_time = format_start_time_to_db(this.second_step_data.start_time ?? '');
                    }
                    this.broadcast_data.second_step_data = this.second_step_data;
                    this.draft_to_save.draft_data = this.second_step_data;
                    break;
                default:
                    break;
            }
        },
        async saveStepDraft(from: 'step' | 'general'): Promise<false | number> {
            this.is_saving_draft = { state: true, from };
            const response = await saveBroadcastDraft(this.draft_to_save);
            this.is_saving_draft = { state: false, from: '' };
            if(!response.result) {
                console.log(response)
                this.toast_error = { state: true, message: response.error ?? 'There was an error saving the draft, please try again.' }; // To activate the toast error message
                setTimeout(() => this.toast_error = { state: false, message: '' }, 500);
                return false
            }
            this.broadcast_id = response.draft_id;
            return response.draft_id
        },
        async saveBroadcastDraft(): Promise<boolean> {
            this.prepareDataToSave();
            const draft_ok = await this.saveStepDraft('general');
            if(!draft_ok) return false
            return true
        },
        async loadLastDraft(broadcast_id: NumberOrNull): Promise<void> {
            if(!broadcast_id) return
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
            //TODO: Need to check and load the advanced data in the future

            if(broadcast.draft_step > 1) {
                if(broadcast.start_time) {
                    this.second_step_data.start_time_selected = 'another';
                    this.second_step_data.start_time = broadcast.start_time;
                } else {
                    this.second_step_data.start_time_selected = 'now';
                    this.second_step_data.start_time = null;
                }
                this.broadcast_data.second_step_data = this.second_step_data;
                const response = await this.checkStartTime()
                if(response.check === false) {
                    this.current_step = 2
                    this.show_suggested_start = { show: true, suggested_start: response.suggested_start ?? '' }
                }
            }
        },
        async deleteDraft(): Promise<void> {
            if(this.broadcast_id === null) {
                this.resetBroascast();
                return
            }

            const data = { broadcast_id: this.broadcast_id };
            this.is_resetting_draft = true;
            const response = await deleteDraft(data);
            this.is_resetting_draft = false;
            if(!response.result) {
                this.toast_error = { state: true, message: 'Something failed while deleting the draft' };
                setTimeout(() => this.toast_error = { state: false, message: '' }, 500);
                return
            }
            this.resetBroascast();
        },
        async checkStartTime(): Promise<{ check: boolean | 'error', suggested_start?: string }> {
            let time = 'now'
            if(this.second_step_data.start_time) {
                time = format_start_time_to_db(this.second_step_data.start_time)
            }
            try {
                const data = { time_to_check: time }
                const response = await checkSelectedStartTime(data)
                if(response.result && response.check === false) {
                    return { check: response.check, suggested_start: response.suggested_start }
                }
                return { check: true }
            } catch (error) {
                console.log(error)
                return { check: 'error' }
            }
        
        }
    }
})