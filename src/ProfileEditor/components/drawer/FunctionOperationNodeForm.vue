<template>
  <a-form :model="formData" auto-label-width size="small">
    <a-form-item label="操作" v-model="formData.id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>
    <a-form-item label="参数" v-model="formData.parameter">
      <a-input v-model="formData.parameter" allow-clear />
    </a-form-item>
    <a-form-item label="是否有返回值" v-model="formData.hasReturn">
      <a-radio-group type="button" v-model="formData.hasReturn" :options="BOOLEAN_STRING_OPTIONS" />
    </a-form-item>

    <MethodEditor :methods="formData.methods" />
  </a-form>
</template>

<script setup lang="ts">
import type { OperationNodeData } from '../../types'
import type { PropType } from 'vue'
import MethodEditor from './MethodEditor/MethodEditor.vue';
import { BOOLEAN_STRING_OPTIONS } from '../../common';

defineProps({
  formData: {
    type: Object as PropType<OperationNodeData>,
    required: true,
  },
})
</script>

<style scoped lang="scss"></style>
