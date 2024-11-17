<template>
  <a-form
    :model="formData"
    :rules="rules"
    size="small"
    ref="formRef"
    auto-label-width
  >
    <a-form-item label="操作" field="id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>
    <a-form-item label="参数" field="parameter">
      <a-input v-model="formData.parameter" allow-clear />
    </a-form-item>
    <a-form-item label="是否有返回值" field="hasReturn">
      <a-radio-group type="button" v-model="formData.hasReturn" :options="BOOLEAN_STRING_OPTIONS" />
    </a-form-item>
    <a-form-item label="指令" field="command">
      <a-textarea v-model="formData.command" allow-clear />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { OperationNodeData } from '../../types';
import { ref, type PropType } from 'vue';
import { type FormInstance } from '@arco-design/web-vue';
import { BOOLEAN_STRING_OPTIONS } from '../../common';

defineExpose({
  validate,
});

defineProps({
  formData: {
    type: Object as PropType<OperationNodeData>,
    required: true,
  },
});

const formRef = ref<FormInstance>();

const rules = {
  id: [
    { required: true, message: '请输入操作名', trigger: 'blur' },
  ],
  command: [
    { required: true, message: '请输入指令', trigger: 'blur' },
  ],
};

async function validate() {
  return formRef.value?.validate();
}
</script>

<style scoped lang="scss"></style>
