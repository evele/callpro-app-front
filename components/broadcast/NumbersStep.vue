<template>
    <div class="grid-container mt-4">
        <NumbersBtn>
            <div class="flex flex-col items-center gap-2">
                <ContactsSVG class="w-10 h-10" />
                <span class="text-xs font-semibold tracking-wider">Choose from Contacts</span>
            </div>
        </NumbersBtn>
        <NumbersBtn>
            <div class="flex flex-col items-center gap-2">
                <GroupsSVG class="w-10 h-10" />
                <span class="text-xs font-semibold tracking-wider">Choose from Groups</span>
            </div>
        </NumbersBtn>
        <NumbersBtn>
            <div class="flex flex-col items-center gap-2">
                <PlusRoundedSVG class="w-10 h-10" />
                <span class="text-xs font-semibold tracking-wider">Add new number</span>
            </div>
        </NumbersBtn>
        <NumbersBtn>
            <div class="flex flex-col items-center gap-2">
                <UploadSVG class="w-10 h-10" />
                <span class="text-xs font-semibold tracking-wider">Upload file</span>
            </div>
        </NumbersBtn>
    </div>
</template>

<script setup lang="ts">
    
</script>
<style scoped lang="scss">
    .grid-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 28px;

        @media (min-width: 1024px) {
            grid-template-columns: repeat(2, minmax(270px, 1fr));
        }
    }
</style>