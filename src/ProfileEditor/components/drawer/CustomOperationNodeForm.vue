<template>
  <a-form :model="formData" auto-label-width size="small">
    <a-form-item label="操作" v-model="formData.id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>

    <MeasureModeEditor :measure-modes="formData.measureModes" />
  </a-form>
</template>

<script setup lang="ts">
import type { OperationNodeData } from '../../types';
import type { PropType } from 'vue';
import MeasureModeEditor from './MeasureModeEditor/MeasureModeEditor.vue';

defineProps({
  formData: {
    type: Object as PropType<OperationNodeData>,
    required: true,
  }
});
</script>

<style scoped lang="scss"></style>