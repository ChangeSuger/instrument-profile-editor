<template>
  <a-form :model="formData" auto-label-width size="small">
    <a-form-item label="型号" v-model="formData.id">
      <a-input v-model="formData.id" allow-clear />
    </a-form-item>
    <a-form-item label="配置方式" v-model="formData.configType">
      <a-radio-group
        type="button"
        v-model="formData.configType"
        :options="CONFIG_TYPE_OPTIONS"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { ModelNodeData } from '../../types'
import type { PropType } from 'vue'
import { CONFIG_TYPE_OPTIONS } from '../../common';

defineProps({
  formData: {
    type: Object as PropType<ModelNodeData>,
    required: true,
  },
})
</script>

<style scoped lang="scss"></style>
