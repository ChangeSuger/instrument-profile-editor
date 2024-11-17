<template>
  <a-form
    :model="formData"
    :rules="rules"
    size="small"
    ref="formRef"
    auto-label-width
  >
    <a-form-item label="配置方式" field="id">
      <a-radio-group type="button" v-model="formData.id" :options="CONFIG_TYPE_OPTIONS" />
    </a-form-item>

    <template v-if="formData.id === 'FUNCTION'">
      <a-form-item label="命名空间" field="spaceName">
        <a-input v-model="formData.spaceName" allow-clear />
      </a-form-item>
      <a-form-item label="类名" field="className">
        <a-input v-model="formData.className" allow-clear />
      </a-form-item>
      <a-form-item label="DLL模板" field="dllTemplate">
        <a-input v-model="formData.dllTemplate" allow-clear />
      </a-form-item>
      <a-form-item label="isVisa" field="isVisa">
        <a-radio-group
          type="button"
          v-model="formData.isVisa"
          :options="BOOLEAN_STRING_OPTIONS"
        />
      </a-form-item>
    </template>

    <template v-if="formData.id === 'CUSTOM'">
      <a-form-item label="通信方法" field="communicationType">
        <a-radio-group
          type="button"
          v-model="formData.communicationType"
          :options="COMMUNICATION_TYPE_OPTIONS"
        />
      </a-form-item>

      <template v-if="formData.communicationType === 'TCP'">
        <a-form-item label="IP地址" field="communicationConfig.ip">
          <a-input v-model="formData.communicationConfig.ip" allow-clear />
        </a-form-item>
        <a-form-item label="端口号" field="communicationConfig.port">
          <a-input v-model="formData.communicationConfig.port" allow-clear />
        </a-form-item>
      </template>

      <template v-else>
        <a-form-item label="波特率" field="communicationConfig.baudRate">
          <a-input v-model="formData.communicationConfig.baudRate" allow-clear />
        </a-form-item>
        <a-form-item label="数据位" field="communicationConfig.dataBits">
          <a-input v-model="formData.communicationConfig.dataBits" allow-clear />
        </a-form-item>
        <a-form-item label="停止位" field="communicationConfig.stopBits">
          <a-select v-model="formData.communicationConfig.stopBits" :options="STOP_BITS_OPTIONS" />
        </a-form-item>
        <a-form-item label="奇偶校验" field="communicationConfig.parity">
          <a-select v-model="formData.communicationConfig.parity" :options="PARITY_OPTIONS" />
        </a-form-item>
        <a-form-item label="缓冲区字节数" field="communicationConfig.bufferBytes">
          <a-input v-model="formData.communicationConfig.bufferBytes" allow-clear />
        </a-form-item>
        <a-form-item label="握手协议" field="communicationConfig.handShake">
          <a-select v-model="formData.communicationConfig.handShake" :options="HAND_SHAKE_OPTIONS" />
        </a-form-item>
        <a-form-item label="超时时间" field="communicationConfig.timeout">
          <a-input v-model="formData.communicationConfig.timeout" allow-clear />
        </a-form-item>
      </template>
    </template>
  </a-form>
</template>

<script setup lang="ts">
import type { ConfigNodeData } from '../../types';
import { ref, type PropType } from 'vue';
import { CONFIG_TYPE_OPTIONS, COMMUNICATION_TYPE_OPTIONS, PARITY_OPTIONS, HAND_SHAKE_OPTIONS, STOP_BITS_OPTIONS, BOOLEAN_STRING_OPTIONS } from '../../common';
import { type FormInstance } from '@arco-design/web-vue';

defineExpose({
  validate,
});

defineProps({
  formData: {
    type: Object as PropType<ConfigNodeData>,
    required: true,
  }
});

const formRef = ref<FormInstance>();

const rules = {
  spaceName: [
    { required: true, message: '请输入命名空间', trigger: 'blur' },
  ],
  className: [
    { required: true, message: '请输入类名', trigger: 'blur' },
  ],
  dllTemplate: [
    { required: true, message: '请输入DLL模板', trigger: 'blur' },
  ],
  'communicationConfig.ip': [
    { required: true, message: '请输入IP地址', trigger: 'blur' },
  ],
  'communicationConfig.port': [
    { required: true, message: '请输入端口号', trigger: 'blur' },
  ],
  'communicationConfig.baudRate': [
    { required: true, message: '请输入波特率', trigger: 'blur' },
  ],
  'communicationConfig.dataBits': [
    { required: true, message: '请输入数据位', trigger: 'blur' },
  ],
  'communicationConfig.stopBits': [
    { required: true, message: '请选择停止位', trigger: 'blur' },
  ],
  'communicationConfig.parity': [
    { required: true, message: '请选择奇偶校验', trigger: 'blur' },
  ],
  'communicationConfig.bufferBytes': [
    { required: true, message: '请输入缓冲区字节数', trigger: 'blur' },
  ],
  'communicationConfig.handShake': [
    { required: true, message: '请选择握手协议', trigger: 'blur' },
  ],
  'communicationConfig.timeout': [
    { required: true, message: '请输入超时时间', trigger: 'blur' },
  ],
};

async function validate() {
  return formRef.value?.validate();
}
</script>

<style scoped lang="scss"></style>