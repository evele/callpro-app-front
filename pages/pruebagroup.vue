<template>
    <div>
        <p class="text-title">Test GroupButton page</p>         
    </div>
    <div class="button-container">
      <GroupButton
        v-for="(button, index) in buttons"
        :key="index"
        :group-name="button.text"
        :contacts-count="button.value"        
        :active="activeButtonIndex === index"
        @click="setActiveButton(index)"
      >
        <!-- iconos personalizados slot -->
        <template #icon>
          <component :is="button.icon" alt="custom-icon" class="custom-icon" />        
          <!-- <GroupsSVG /> -->
        </template>
      </GroupButton>
    </div>
  </template>
  
  <script setup lang="ts">
  import ContactsSVG from "@/components/svgs/AllSVG.vue";
  import GroupsSVG from "@/components/svgs/UnassignedSVG.vue";
  import DncSVG from "@/components/svgs/MyGroupsSVG.vue";
  import UploadSVG from "@/components/svgs/TrashSVG.vue";
  
  const buttons = [
    { text: 'ALLddddd', value: 0, icon: ContactsSVG },
    { text: 'Unassigned', value: Math.floor(Math.random() * 100), icon: GroupsSVG },
    { text: 'Monthly Number', value: Math.floor(Math.random() * 100), icon: DncSVG },
    { text: 'Trash', value: Math.floor(Math.random() * 100), icon: UploadSVG }
  ];
  
  buttons[0].value = buttons.slice(1).reduce((acc, button) => acc + button.value, 0);
  
  const activeButtonIndex = ref<number | null>(0);
  
  const setActiveButton = (index: number) => {
    activeButtonIndex.value = index;
  };
  </script>
  <style scoped>
  .button-page {
      display: flex;
      flex-direction: column;
      gap: 10px;
  }
  .styled-button.active {
    background-color: var(--Schemes-On-Primary, #6750A4);
    color: var(--Schemes-Surface-Tint, #FFF);
  }
  
  .styled-button :deep(.custom-button) {
    background-color: var(--Schemes-Surface-Tint, #6750A4);
  }
  
  .styled-button.active :deep(.custom-button) {
    background-color: var(--Schemes-On-Primary, #FFF);
  }
  </style>