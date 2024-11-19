<template>
    <div class="bg-white rounded-2xl my-4 mx-6">
        <Tabs value="0">
            <div class="flex justify-between py-7 px-12 border-b">
                <TabList class="flex items-center">
                    <Tab value="0" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10" @click="console.log(voice_settings)">Voice settings</Tab>
                    <Tab value="1" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Text settings</Tab>
                    <Tab value="2" class="text-lg rounded border-none py-0 px-[10px] h-8">General settings</Tab>
                </TabList>
                <Button label="Save" class="w-32 h-9 ml-auto transition-opacity" :class="[show_save_button ? 'opacity-1' : 'opacity-0']" 
                    @click="handle_save_settings" :disabled="disabled_save_button" />
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
</template>

<script setup lang="ts">
    const { data: settings, isLoading } = useFetchSettings()
    const { mutate: updateVoiceSettings } = useUpdateVoiceSettings()
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

    const show_save_button = ref(false)
    const disabled_save_button = ref(false)

    const voice_settings_mounted = ref(false)
    const handle_update_voice_settings = (voice_settings: VoiceSettingsUI) => {
        if(!voice_settings_mounted.value) { // Prevents the first update (when settings are loaded) from being sent
            voice_settings_mounted.value = true
            return;
        }
        show_save_button.value = true
        voice_settings_ui.value = voice_settings
    }

    const handle_save_settings = () => {
        const voice_settings_to_save =  {
        
        }
        console.log('aca?', voice_settings_to_save)
        return


        const dataToSend: VoiceSettingsDataToSave = {
                'settings': voice_settings,
                'cid_confirm': user_admin_settings.value.cid_confirm,
            }
        updateVoiceSettings(dataToSend)
    }

    const handle_voice_settings_error = (hasError: boolean) => {
        disabled_save_button.value = hasError
    }
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