<template>
  <a-form
    :model="formData"
    :rules="rules"
    size="small"
    ref="formRef"
    auto-label-width
  >
    <a-form-item label="设备类别" field="id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { InstrumentNodeData } from '../../types';
import { ref, type PropType } from 'vue';
import { type FormInstance } from '@arco-design/web-vue';

defineExpose({
  validate,
});

defineProps({
  formData: {
    type: Object as PropType<InstrumentNodeData>,
    required: true,
  },
});

const formRef = ref<FormInstance>();

const rules = {
  id: [
    { required: true, message: '请输入设备类别', trigger: 'blur' },
  ],
};

async function validate() {
  return formRef.value?.validate();
}
</script>

<style scoped lang="scss"></style>
