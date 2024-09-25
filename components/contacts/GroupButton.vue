<template>
  <Button :class="['group-button', { 'active': active }]" @click="handleClick">
    <!-- slot para renderizar -->
    <div :class="['icon-bg', { 'icon-active': active }]"><slot name="icon"></slot></div>
    <div :class="['content', { 'name-active': active }]">
      {{ groupName }}
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
  width: 100%;
  height: 50px;
  padding: 12px;
  align-items: center;
  gap: 10px;  
  border-radius: 10px;
  border: none;
  background: #F4F0EF;  
  transition: background 0.3s ease;
}
.content {

  color: #1D192B;  
  font-size: 14px;  
  font-weight: 500; 

  .contacts-count {
    margin-left: 12px;
    color: #79747E;    
    font-size: 11px;
  }  
}
.name-active{
    color: #FFF;
  }

.icon-bg{
  width: 28px;
  height: 28px;
  background-color: #E8DEF8;
  color: #1E1E1E;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-active{
  background-color: #FFF;
  color: #1E1E1E;
}

.group-button.active {
  background: #6750A4;
  color: #FFF;
}

.group-button.active .contacts-count {
  color:#FFF;
}
</style>