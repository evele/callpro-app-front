<template>
    <p class="text-title">Groups page</p>
    <div>
        <span v-if="isLoadingSG">Loading system groups...</span>
        <span v-else-if="isErrorSG">Something failed while getting system groups.</span>
        <div v-else-if="isSuccessSG">
            <p style="font-weight: 600; line-height: 10px;">System groups</p>
            <ul v-if="SGData.result">
                <li>All: {{ Object.values(SGData.system_groups)[0] }}</li>
                <li>Unassigned: {{ Object.values(SGData.system_groups)[1] }}</li>
                <li>Trash: {{ Object.values(SGData.system_groups)[2] }}</li>
            </ul>
            <p v-else>{{ SGData.db_error }}</p>
        </div>
    </div>

    <div>
        <span v-if="isLoadingCG">Loading custom groups...</span>
        <span v-else-if="isErrorCG">Something failed while getting custom groups.</span>
        <div v-else-if="isSuccessCG">
            <p style="font-weight: 600; margin-top: 3rem; line-height: 10px;">Custom groups</p>
            <div v-if="CGData.result">
                <ul v-if="CGData.custom_groups.length">
                    <li v-for="group in CGData.custom_groups" :key="group.id">
                        {{ group.group_name }}: {{ group.count }}
                    </li>
                </ul>
                <span v-else>No custom groups to show.</span>
            </div>
            <p v-else>{{ CGData.db_error }}</p>
        </div>
    </div>
</template>

<script setup>
    const { data: SGData, isLoading: isLoadingSG, isSuccess: isSuccessSG, isError: isErrorSG } = useFetchGetSystemGroups()
    const { data: CGData, isLoading: isLoadingCG, isSuccess: isSuccessCG, isError: isErrorCG } = useFetchGetCustomGroups()

</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>