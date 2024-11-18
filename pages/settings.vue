<template>
    <div class="bg-white rounded-2xl my-4 mx-6">
        <Tabs value="0">
            <div class="flex justify-between py-7 px-12 border-b">
                <TabList class="flex items-center">
                    <Tab value="0" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10" @click="console.log(voice_settings)">Voice settings</Tab>
                    <Tab value="1" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Text settings</Tab>
                    <Tab value="2" class="text-lg rounded border-none py-0 px-[10px] h-8">General settings</Tab>
                </TabList>
                <Button label="Save" class="w-32 h-9 ml-auto" />
            </div>

            <TabPanels class="max-h-[75vh] overflow-y-auto pl-14 pr-10 rounded-2xl">
                <TabPanel value="0">
                    <div v-if="isLoading">
                        <div class="flex flex-col w-[75%]">
                            <Skeleton class="mb-2"></Skeleton>
                            <Skeleton class="mb-2 !w-[75%]"></Skeleton>
                            <Skeleton class="mb-2 !w-[50%]"></Skeleton>
                        </div>
                        <Divider />
                        <div class="flex flex-col w-[75%]">
                            <Skeleton class="mb-2"></Skeleton>
                            <Skeleton class="mb-2 !w-[75%]"></Skeleton>
                            <Skeleton class="mb-2 !w-[50%]"></Skeleton>
                        </div>
                        <Divider />
                        <div class="flex flex-col w-[75%]">
                            <Skeleton class="mb-2"></Skeleton>
                            <Skeleton class="mb-2 !w-[75%]"></Skeleton>
                            <Skeleton class="mb-2 !w-[50%]"></Skeleton>
                        </div>
                        <Divider />
                        <div class="flex flex-col w-[75%]">
                            <Skeleton class="mb-2"></Skeleton>
                            <Skeleton class="mb-2 !w-[75%]"></Skeleton>
                            <Skeleton class="mb-2 !w-[50%]"></Skeleton>
                        </div>
                    </div>
                    <VoiceSettings v-else :voice-settings="voice_settings" @updateVoiceSettings="handle_update_voice_settings" />
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
    
    const generalStore = useGeneralStore()

    const voice_settings = computed(() => {
        if(!settings?.value?.result) return null;
        return settings.value.settings
    })

    const handle_update_voice_settings = (voice_settings) => {
        console.log(voice_settings)
    }

    const format_value = (value: ZeroOrOne) => {
        return value == '1' ? ON : OFF;
    }

    const format_tz = (value: OneToNine) => {
        if(!generalStore.timezones?.length) return '';
        const tz = generalStore.timezones?.find((tz: Timezone) => tz.zones_id == value)?.display;
        return tz;
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