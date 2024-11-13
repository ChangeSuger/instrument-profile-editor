<template>
  <a-form :model="formData" auto-label-width size="small">
    <a-form-item label="操作" v-model="formData.id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>
    <a-form-item label="参数" v-model="formData.parameter">
      <a-input v-model="formData.parameter" allow-clear />
    </a-form-item>
    <a-form-item label="是否有返回值" v-model="formData.hasReturn">
      <a-radio-group type="button" v-model="formData.hasReturn">
        <a-radio value="true">是</a-radio>
        <a-radio value="false">否</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="指令" v-model="formData.command">
      <a-textarea v-model="formData.command" allow-clear />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { OperationNodeData } from '@/ProfileEditor/types';
import type { PropType } from 'vue';

defineProps({
  formData: {
    type: Object as PropType<OperationNodeData>,
    required: true,
  }
});
</script>

<style scoped lang="scss"></style>