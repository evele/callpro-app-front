<!-- import { UserCallInCode } from '../utils/api-calls/call_in_code'; -->
<template>    
    <div>
        <p class="text-title">Call in codes page</p>        
    </div>
    <ModalCallInCodes ref="modalCallInCodes"/>
    <Button label="Modal Call in Codes" @click="open_modal" />    
   
</template>

<script setup lang="ts">
    const modalCallInCodes = ref()

    const open_modal = () => {
        modalCallInCodes.value.open();
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }    
</style>