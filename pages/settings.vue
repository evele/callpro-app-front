<template>
    <div class="bg-white rounded-2xl my-4 mx-6">
        <Tabs value="0">
            <div class="flex justify-between py-7 px-12 border-b">
                <TabList class="flex items-center">
                    <Tab value="0" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10" @click="console.log(voice_settings)">Voice settings</Tab>
                    <Tab value="1" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Text settings</Tab>
                    <Tab value="2" class="text-lg rounded border-none py-0 px-[10px] h-8">General settings</Tab>
                </TabList>
                <Button class="w-32 h-9 ml-auto transition-opacity" :class="[show_save_button ? 'opacity-1' : 'opacity-0']" 
                    @click="handle_save_settings" :disabled="disabled_save_button">
                    {{ is_saving_settings ? 'Saving...' : 'Save' }}
                </Button>
            </div>

            <TabPanels class="max-h-[75vh] overflow-y-auto pl-14 pr-10 rounded-2xl">
                <TabPanel value="0">
                    <SettingsSkeleton v-if="isLoading" />
                    <VoiceSettings v-else :voice-settings="voice_settings" @updateVoiceSettings="handle_update_voice_settings" @hasError="handle_voice_settings_error" />
                </TabPanel>
                <TabPanel value="1">
                    <p class="m-0">
                        Text settings
                    </p>
                </TabPanel>
                <TabPanel value="2">
                    <p class="m-0">
                        General settings
                    </p>
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
    const { mutate: updateVoiceSettings, isPending: is_saving_settings } = useUpdateVoiceSettings()
    const { mutate: updateTextSettings } = useUpdateTextSettings()

    const voice_settings = computed(() => {
        if(!settings?.value?.result) return null;
        return settings.value.settings
    })

    const user_admin_settings = computed(() => {
        if(!settings?.value?.result) return null;
        return settings.value.user_admin_settings
    })

    const voice_settings_ui = ref<VoiceSettingsUI | null>(null)

    const toast = useToast()
    const show_save_button = ref(false)
    const has_error = ref(false)
    const visible = ref(false)

    const voice_settings_mounted = ref(false)
    const handle_update_voice_settings = (voice_settings: VoiceSettingsUI) => {
        if(!voice_settings_mounted.value) { // Prevents the first update (when settings are loaded) from being sent
            voice_settings_mounted.value = true
            return;
        }
        show_save_button.value = true
        voice_settings_ui.value = voice_settings
    }

    const format_voice_settings_to_save = (voice_settings_ui: VoiceSettingsUI) => {
        const formatted_settings: VoiceSettings = {
            amd_detection: voice_settings_ui.amd_detection ? '1' : '0',
            call_speed: voice_settings_ui.call_speed.code,
            caller_id: voice_settings_ui.caller_id.replace(/\D/g, ''),
            email_on_finish: voice_settings_ui.email_on_finish ? '1' : '0',
            number_when_completed: voice_settings_ui.number_when_completed.replace(/\D/g, ''),
            number_when_completed_status: voice_settings_ui.number_when_completed_status ? '1' : '0',
            offer_dnc: voice_settings_ui.offer_dnc ? '1' : '0',
            repeat: voice_settings_ui.repeat ? '1' : '0',
            repeat_audio: "system",
            repeat_library_id: null,
            retries: voice_settings_ui.retries.code,
            static_intro: voice_settings_ui.static_intro ? '1' : '0',
            static_intro_library_id: 0,
        }

        return formatted_settings
    }

    const handle_save_settings = () => {
        if(!voice_settings_ui.value) return;
        const voice_settings_to_save = format_voice_settings_to_save(voice_settings_ui.value)
        
        //TODO: Need to do this now, but will be removed when the other settings are implemented
        const others_settings_to_save: GeneralSettings = {
            'time_zone': '2',
            'time_guard': '0',
            'call_window_start': voice_settings?.value?.call_window_start ?? '',
            'call_window_end': voice_settings?.value?.call_window_end ?? '',
        }
        
        const settings_to_save: Settings = {
            ...voice_settings_to_save,
            ...others_settings_to_save
        }

        const dataToSend: VoiceSettingsDataToSave = {
            'settings': settings_to_save,
            'cid_confirm': user_admin_settings?.value?.cid_confirm ?? '0',
        }

        updateVoiceSettings(dataToSend, {
            onSuccess: (response: APIResponseSuccess | APIResponseError) => {
                    if(response.result) {
                        show_save_button.value = false
                        visible.value = true
                        setTimeout(() => visible.value = false, 2000)
                    } else {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while saving the settings', life: 3000 })
                    }
                },
            onError: () =>  toast.add({ severity: 'error', summary: 'Error', detail: 'Something failed while saving the settings', life: 3000 })
        })
    }

    const disabled_save_button = computed(() => has_error.value || is_saving_settings.value)

    const handle_voice_settings_error = (hasError: boolean) => has_error.value = hasError
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