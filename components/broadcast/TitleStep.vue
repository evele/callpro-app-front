<template>
    <div class="w-full pt-14">
        <div class="flex justify-between items-center ">
            <label for="broadcast-name" class="text-lg text-dark-3 font-medium">Broadcast Name</label>
            <div class="relative max-w-[294px] w-full">
                <InputText 
                    id="broadcast-name"
                    class="w-full py-3 border h-10 placeholder-grey-7"
                    placeholder="Enter your broadcast name" 
                    v-model="first_step_data.broadcast_name"
                    :invalid="error_message?.length > 0"
                    @input="broadcastStore.clearErrorMessage"
                />
                <span v-show="error_message?.length" class="text-danger text-sm absolute mt-1 left-0 top-full">
                    {{ error_message }}
                </span> 
            </div>
        </div>
        <div class="h-[1px] w-full bg-grey-7 mt-16"></div>
    </div>
</template>

<script setup lang="ts">
const broadcastStore = useBroadcastStore();
const { first_step_data, error_message } = storeToRefs(broadcastStore)
</script>