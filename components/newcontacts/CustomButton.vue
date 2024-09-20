<template lang="">
    <div class="custom-button"    :class="{ 'active': active }"     @click="handleClick">    
    <slot name="icon"></slot> 
    <div class="content">
      <span class="text">{{ text }}</span>
      <span class="value">{{ value }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    }, 
    active: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);
const handleClick = () => {
  emit('click');
};

</script>
<style scoped>
.custom-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  cursor: pointer;
  border-radius: 10px;
  background: var(--Schemes-Surface-Tint, #FFF);
  color: var(--Schemes-On-Primary, #6750A4);
  transition: background 0.3s ease; 
}

.custom-button.active {
  background: var(--Schemes-On-Primary, #6750A4);
  color: var(--Schemes-Surface-Tint, #FFF); 
}

.content {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.text {
  margin-right: 5px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.value {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  color: var(--Schemes-Surface-Container-Low, #1c1b1d);
}
</style>