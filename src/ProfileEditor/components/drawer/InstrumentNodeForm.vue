<template>
  <a-form :model="formData" auto-label-width size="small">
    <a-form-item label="设备类别" v-model="formData.id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { InstrumentNodeData } from '@/ProfileEditor/types';
import type { PropType } from 'vue';

defineProps({
  formData: {
    type: Object as PropType<InstrumentNodeData>,
    required: true,
  }
});
</script>

<style scoped lang="scss"></style>