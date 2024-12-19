<template>
    <div class="bg-white rounded-2xl my-4 mx-6">
        <Tabs v-model:value="selected_tab">
            <div class="flex justify-between py-7 px-12 border-b">
                <TabList class="flex items-center">
                    <Tab value="voice" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Voice settings</Tab>
                    <Tab value="text" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Text settings</Tab>
                    <Tab value="general" class="text-lg rounded border-none py-0 px-[10px] h-8">General settings</Tab>
                </TabList>

                <Button v-if="selected_tab === 'voice'" class="w-32 h-9 ml-auto transition-opacity" :class="[show_save_voice_settings_button ? 'opacity-1' : 'opacity-0']" 
                    @click="handle_save_voice_settings" :disabled="disabled_save_voice_settings_button">
                    {{ is_saving_voice_settings ? 'Saving...' : 'Save' }}
                </Button>

                <Button v-if="selected_tab === 'text'" class="w-32 h-9 ml-auto transition-opacity" :class="[show_save_text_settings_button ? 'opacity-1' : 'opacity-0']" 
                    @click="handle_save_text_settings" :disabled="disabled_save_text_settings_button">
                    {{ is_saving_text_settings ? 'Saving...' : 'Save' }}
                </Button>

                <Button v-if="selected_tab === 'general'" class="w-32 h-9 ml-auto transition-opacity" :class="[show_save_general_settings_button ? 'opacity-1' : 'opacity-0']" 
                    @click="handle_save_general_settings" :disabled="disabled_save_general_settings_button">
                    {{ is_saving_general_settings ? 'Saving...' : 'Save' }}
                </Button>
            </div>

            <TabPanels class="max-h-[75vh] overflow-y-auto pl-14 pr-10 rounded-2xl">
                <TabPanel value="voice">
                    <SettingsSkeleton v-if="isLoading" />
                    <VoiceSettings v-else :voice-settings="voice_settings" @updateVoiceSettings="handle_update_voice_settings" @hasError="handle_voice_settings_error" />
                </TabPanel>
                <TabPanel value="text">
                    <TextSettings :text-settings="text_settings" @updateTextSettings="handle_update_text_settings" @hasError="handle_text_settings_error" />
                </TabPanel>
                <TabPanel value="general">
                    <GeneralSettings :general-settings="general_settings" @updateGeneralSettings="handle_update_general_settings" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>

    <Dialog v-model:visible="visible" pt:root:class="!border rounded-lg border-[#D9D9D9] !bg-white w-full max-w-[32rem] p-8" pt:mask:class="bg-white bg-opacity-70">
        <template #container>
            <div class="flex flex-col justify-center items-center gap-4">
                <div class="relative">
                    <CircleEmptySVG class="w-[72px] h-[72px] text-[#009951]" />
                    <CheckSVG class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] text-[#009951]" />
                </div>
                <span class="text-black text-lg leading-none">Ready!</span>
            </div>
        </template>
    </Dialog>
    <Toast />
</template>

<script setup lang="ts">
    const { data: settings, isLoading } = useFetchSettings()
    const { mutate: updateVoiceSettings, isPending: is_saving_voice_settings } = useUpdateVoiceSettings()
    const { mutate: updateTextSettings, isPending: is_saving_text_settings } = useUpdateTextSettings()
    const { mutate: updateGeneralSettings, isPending: is_saving_general_settings } = useUpdateGeneralSettings()

    const toast = useToast()
    const visible = ref(false)
    const selected_tab = ref('voice')

    /* ----- Begin Voice Settings ----- */
    const voice_settings = computed(() => {
        if(!settings?.value?.result) return null;
        const { time_guard, time_zone, call_window_end, call_window_start, ...filteredSettings } = settings.value.settings
        return filteredSettings
    })

    const user_admin_settings = computed(() => {
        if(!settings?.value?.result) return null;
        return settings.value.user_admin_settings
    })

    const voice_settings_ui = ref<VoiceSettingsUI | null>(null)
    const show_save_voice_settings_button = ref(false)
    const has_error_voice = ref(false)
    const disabled_save_voice_settings_button = computed(() => has_error_voice.value || is_saving_voice_settings.value || !show_save_voice_settings_button.value)

    const voice_settings_mounted = ref(false)
    const handle_update_voice_settings = (voice_settings: VoiceSettingsUI) => {
        if(!voice_settings_mounted.value) { // Prevents the first update (when settings are loaded) from being sent
            voice_settings_mounted.value = true
            return;
        }
        show_save_voice_settings_button.value = true
        voice_settings_ui.value = voice_settings
    }

    const format_voice_settings_to_save = (voice_settings_ui: VoiceSettingsUI) => {
        const formatted_settings: VoiceSettings = {
            amd_detection: voice_settings_ui.amd_detection ? '1' : '0',
            call_speed: voice_settings_ui.call_speed ?? '5',
            caller_id: voice_settings_ui.caller_id.replace(/\D/g, ''),
            email_on_finish: voice_settings_ui.email_on_finish ? '1' : '0',
            number_when_completed: voice_settings_ui.number_when_completed.replace(/\D/g, ''),
            number_when_completed_status: voice_settings_ui.number_when_completed_status ? '1' : '0',
            offer_dnc: voice_settings_ui.offer_dnc ? '1' : '0',
            repeat: voice_settings_ui.repeat ? '1' : '0',
            repeat_audio: "system",
            repeat_library_id: null,
            retries: voice_settings_ui.retries ?? '1',
            static_intro: voice_settings_ui.static_intro ? '1' : '0',
            static_intro_library_id: 0,
        }

        return formatted_settings
    }

    const handle_save_voice_settings = () => {
        if(!voice_settings_ui.value) return;

        const voice_settings_to_save: VoiceSettings = format_voice_settings_to_save(voice_settings_ui.value)

        const dataToSend: VoiceSettingsDataToSave = {
            'settings': voice_settings_to_save,
            'cid_confirm': user_admin_settings?.value?.cid_confirm ?? '0',
        }

        updateVoiceSettings(dataToSend, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_save_voice_settings_button.value = false
                    visible.value = true
                    setTimeout(() => visible.value = false, 2000)
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while saving voice settings', life: 3000 })
                }
            },
            onError: () =>  toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while saving voice settings', life: 3000 })
        })
    }

    const handle_voice_settings_error = (hasError: boolean) => has_error_voice.value = hasError
    /* ----- End Voice Settings ----- */

    /* ----- Begin Text Settings ----- */
    const text_settings = computed(() => {
        if(!settings?.value?.result) return null;
        return settings.value.text_settings
    })

    const text_settings_ui = ref<TextSettingsUI | null>(null)
    const show_save_text_settings_button = ref(false)
    const has_error_text = ref(false)
    const disabled_save_text_settings_button = computed(() => has_error_text.value || is_saving_text_settings.value || !show_save_text_settings_button.value)

    const text_settings_mounted = ref(false)
    const handle_update_text_settings = (text_settings: TextSettingsUI) => {
        if(!text_settings_mounted.value) { // Prevents the first update (when settings are loaded) from being sent
            text_settings_mounted.value = true
            return;
        }
        show_save_text_settings_button.value = true
        text_settings_ui.value = text_settings
    }

    const format_text_settings_to_save = (text_settings_ui: TextSettingsUI) => {
        const formatted_settings: TextSettings = {
            text_caller_id: text_settings_ui.text_caller_id.replace(/\D/g, ''),
            chat: text_settings_ui.chat ? '1' : '0',
            sms_dnc: text_settings_ui.sms_dnc ? '1' : '0'
        }
        return formatted_settings
    }

    const handle_save_text_settings = () => {
        if(!text_settings_ui.value) return;

        const text_settings_to_save: TextSettings = format_text_settings_to_save(text_settings_ui.value)

        const dataToSend: TextSettingsDataToSave = {
            'settings': text_settings_to_save
        }

        updateTextSettings(dataToSend, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_save_text_settings_button.value = false
                    text_settings_mounted.value = false
                    visible.value = true
                    setTimeout(() => visible.value = false, 2000)
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while saving text settings', life: 3000 })
                }
            },
            onError: () =>  toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while saving text settings', life: 3000 })
        })
    }

    const handle_text_settings_error = (hasError: boolean) => has_error_text.value = hasError
    /* ----- End Text Settings ----- */

    /* ----- Begin General Settings ----- */
    const general_settings = computed(() => {
        if(!settings?.value?.result) return null;
        const { time_guard, time_zone, call_window_end, call_window_start, ...filteredSettings } = settings.value.settings
        return { time_guard, time_zone, call_window_end, call_window_start }
    })

    const general_settings_formatted = ref<GeneralSettings | null>(null)
    const show_save_general_settings_button = ref(false)
    const disabled_save_general_settings_button = computed(() => is_saving_general_settings.value || !show_save_general_settings_button.value)

    const general_settings_mounted = ref(false)
    const handle_update_general_settings = (general_settings: GeneralSettings) => {
        if(!general_settings_mounted.value) { // Prevents the first update (when settings are loaded) from being sent
            general_settings_mounted.value = true
            return;
        }
        show_save_general_settings_button.value = true
        general_settings_formatted.value = general_settings
    }

    const handle_save_general_settings = () => {
        if(!general_settings_formatted.value) return;

        const general_settings_to_save: GeneralSettings = { ...general_settings_formatted.value }

        const dataToSend: GeneralSettingsDataToSave = {
            'settings': general_settings_to_save
        }

        updateGeneralSettings(dataToSend, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                if(response.result) {
                    show_save_general_settings_button.value = false
                    general_settings_mounted.value = false
                    visible.value = true
                    setTimeout(() => visible.value = false, 2000)
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while saving general settings', life: 3000 })
                }
            },
            onError: () =>  toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while general text settings', life: 3000 })
        })
    }
    /* ----- End General Settings ----- */
</script>

<style scoped lang="scss">
    :deep(.p-tabs) {
        .p-tablist {
            .p-tablist-content {
                align-items: center;
            }

            .p-tablist-tab-list {
                border: none;
                align-items: center;

                .p-tab-active {
                    background-color: rgba(208, 188, 255, 0.16);
                    color: #6750A4;
                }
                .p-tablist-active-bar {
                    display: none;
                }
            }
        }
    }
</style>