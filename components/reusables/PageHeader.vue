<template>
    <div class="px-9 py-6 bg-white h-20">
     <h1>{{text}}</h1>
     <slot></slot>
    </div>
     
 </template>
 <script setup lang="ts">
     const props = defineProps({
         text: {
             type: String,
         },
     });
 </script>