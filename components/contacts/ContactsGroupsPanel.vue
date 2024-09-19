<template>
    <nav class="container flex flex-col">
        <div>
            <h4 class="groups-title">Groups</h4>

            <ul class="flex flex-col default-groups-ul">
                
            </ul>
        </div>

        <div>

        </div>
    </nav>
</template>

<script setup lang="ts">
    import EditIconSVG from "@/components/svgs/EditIconSVG.vue"
</script>

<style scoped lang="scss">
    .container {
        max-width: 250px; 
        min-height: 500px;
        border-radius: 16px;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        overflow: hidden;
        background-color: #FFF;
        gap: 12px;
        padding: 28px 16px;
    }

    .groups-title {
        font-size: 20px;
        font-weight: 600;
        line-height: 140%;
    }
    
    .default-groups-ul {
        gap: 6px;
    }
</style>