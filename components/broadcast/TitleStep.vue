<template>
    <div class="w-full pt-14">
        <div class="flex justify-between items-center ">
            <label for="broadcast-name" class="text-lg text-dark-3 font-medium">Broadcast Name</label>
                <InputText 
                    id="broadcast-name"
                    class="py-3 border h-10 placeholder-grey-7 max-w-[294px] w-full"
                    placeholder="Enter your broadcast name" 
                    v-model="first_step_data.broadcast_name"
                    @input="broadcastStore.clearErrorMessage"
                />
        </div>
        <div class="h-[1px] w-full bg-grey-7 mt-16"></div>
    </div>
</template>

<script setup lang="ts">
const broadcastStore = useBroadcastStore();
const { first_step_data } = storeToRefs(broadcastStore)
</script>