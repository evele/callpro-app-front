<template>
    <Card class="my-4 mx-6 relative">
        <template #content>
            <Tabs value="0" class="pt-3 px-6">
                <TabList class="pb-8">
                    <Tab value="0" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10" @click="console.log(voice_settings)">Voice settings</Tab>
                    <Tab value="1" class="text-lg rounded border-none py-0 px-[10px] h-8 mr-10">Text settings</Tab>
                    <Tab value="2" class="text-lg rounded border-none py-0 px-[10px] h-8">General settings</Tab>
                </TabList>

                <Divider class="absolute left-0 top-[75px]" />

                <TabPanels>
                    <TabPanel value="0">
                        <SettingSection title="Caller ID" description="Set the phone number that appears on the caller ID.">
                            <div class="flex justify-between gap-2 items-center mb-7">
                                <label class="text-lg font-medium min-w-fit">Caller ID</label>
                                <Select v-model="option_selected" :options="caller_id_options" optionLabel="name" class="w-[294px] mt-1" placeholder="Select" />
                            </div>
                            <div class="flex justify-between items-center">
                                <label class="text-lg font-medium min-w-fit">Enter Caller ID</label>
                                <PhoneInput class="mt-[2px] w-[294px]" :model-value="caller_id_number" @update:modelValue="(v: string) => caller_id_number = v" />
                            </div>
                        </SettingSection>
                        <Divider class="mb-[22px] "/>

                        <SettingSection title="Static Intro" description="Include a professional or personalizad message as an intro to your voice broadcast.">
                            <div class="flex justify-between items-center mb-7">
                                <label class="text-lg font-medium">Static audio introduction</label>
                                <ToggleSwitch v-model="checked" class="h-7" />
                            </div>
                            
                        </SettingSection>
                        <Divider />
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
        </template>
    </Card>
</template>

<script setup lang="ts">
    const { data: settings } = useFetchSettings()
    const { mutate: updateVoiceSettings } = useUpdateVoiceSettings()
    const { mutate: updateTextSettings } = useUpdateTextSettings()
    
    const generalStore = useGeneralStore()

    const voice_settings = computed(() => {
        if(!settings?.value?.result) return null;
        return settings.value.settings
    })

    const caller_id_number = ref('')
    const option_selected = ref('3')
    const caller_id_options = [
        { name: 'Your CallPro Number', code: '1' },
        { name: 'Toll Free Number', code: '2' },
        { name: 'Choose Caller ID', code: '3' },
    ]

    const checked = ref(false);

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
            width: fit-content;
            .p-tablist-tab-list {
                border: none;
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