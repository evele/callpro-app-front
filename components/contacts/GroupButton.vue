<template>
  <Button :class="['group-button', { 'active': active }]" @click="handleClick">
    <!-- slot para renderizar -->
    <slot name="icon"></slot>       
    <div class="content">
      <span class="group-name">{{ groupName }}</span>
      <span class="contacts-count">{{ contactsCount }}</span>
    </div>
  </Button>
</template>

<script setup lang="ts">
const props = defineProps({
  groupName: {
    type: String,
    required: true
  },
  contactsCount: {
    type: [String, Number],
    default: undefined
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
.group-button {
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

.group-button.active {
  background: var(--Schemes-On-Primary, #6750A4);
  color: var(--Schemes-Surface-Tint, #FFF);
}

.content {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.group-name {
  margin-right: 5px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.contacts-count {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  color: var(--Schemes-Surface-Container-Low, #1c1b1d);
}

.group-button.active .contacts-count {
  color: var(--Schemes-Surface-Tint, #FFF); 
}
</style>