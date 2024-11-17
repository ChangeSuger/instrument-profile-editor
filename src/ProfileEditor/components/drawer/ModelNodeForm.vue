<template>
  <a-form
    :model="formData"
    :rules="rules"
    size="small"
    ref="formRef"
    auto-label-width
  >
    <a-form-item label="型号" field="id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>
    <a-form-item label="配置方式" field="configType">
      <a-radio-group
        type="button"
        v-model="formData.configType"
        :options="CONFIG_TYPE_OPTIONS"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { ModelNodeData } from '../../types';
import { ref, type PropType } from 'vue';
import { type FormInstance } from '@arco-design/web-vue';
import { CONFIG_TYPE_OPTIONS } from '../../common';

defineExpose({
  validate,
});

defineProps({
  formData: {
    type: Object as PropType<ModelNodeData>,
    required: true,
  },
});

const formRef = ref<FormInstance>();

const rules = {
  id: [
    { required: true, message: '请输入型号', trigger: 'blur' },
  ],
};

async function validate() {
  return formRef.value?.validate();
}
</script>

<style scoped lang="scss"></style>
