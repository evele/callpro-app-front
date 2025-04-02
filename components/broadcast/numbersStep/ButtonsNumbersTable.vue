<template>
    <div class="flex flex-wrap gap-3 items-center">
        <ButtonWithIcon btnText="Choose from Contacts" :gray-bg="true" @click="handle_emit_action('contacts')">
            <template #icon>
                <ContactsSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon btnText="Choose from Groups" :gray-bg="true" @click="handle_emit_action('groups')">
            <template #icon>
                <GroupsSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon btnText="Add new number" :gray-bg="true" @click="handle_emit_action('new')">
            <template #icon>
                <PlusRoundedSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon btnText="Upload file" :gray-bg="true" @click="handle_emit_action('upload')">
            <template #icon>
                <UploadSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>

        <ButtonWithIcon btnText="Clear selection" :gray-bg="true" :red-text="true" @click="handle_emit_action('clear')">
            <template #icon>
                <TrashSVG class="w-5 h-5" />
            </template>
        </ButtonWithIcon>
    </div>
</template>

<script setup lang="ts">
    const emit = defineEmits<{
        (event: 'update:action-selected', action: BroadcastNumbersBtnActions): void
    }>()

    const handle_emit_action = (action: BroadcastNumbersBtnActions) => {
        emit('update:action-selected', action)
    }
</script>