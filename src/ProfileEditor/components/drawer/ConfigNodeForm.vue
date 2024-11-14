<template>
  <a-form :model="formData" auto-label-width size="small">
    <a-form-item label="配置方式" v-model="formData.id">
      <a-radio-group type="button" v-model="formData.id" :options="CONFIG_TYPE_OPTIONS" />
    </a-form-item>

    <template v-if="formData.id === 'FUNCTION'">
      <a-form-item label="命名空间" v-model="formData.spaceName">
        <a-input v-model="formData.spaceName" allow-clear />
      </a-form-item>
      <a-form-item label="类名" v-model="formData.className">
        <a-input v-model="formData.className" allow-clear />
      </a-form-item>
      <a-form-item label="DLL模板" v-model="formData.dllTemplate">
        <a-input v-model="formData.dllTemplate" allow-clear />
      </a-form-item>
      <a-form-item label="isVisa" v-model="formData.isVisa">
        <a-radio-group type="button" v-model="formData.isVisa" :options="BOOLEAN_STRING_OPTIONS" />
      </a-form-item>
    </template>

    <template v-if="formData.id === 'CUSTOM'">
      <a-form-item label="通信方法" v-model="formData.communicationType">
        <a-radio-group type="button" v-model="formData.communicationType" :options="COMMUNICATION_TYPE_OPTIONS" />
      </a-form-item>

      <template v-if="formData.communicationType === 'TCP'">
        <a-form-item label="IP地址" v-model="formData.communicationConfig.ip">
          <a-input v-model="formData.communicationConfig.ip" allow-clear />
        </a-form-item>
        <a-form-item label="端口号" v-model="formData.communicationConfig.port">
          <a-input v-model="formData.communicationConfig.port" allow-clear />
        </a-form-item>
      </template>

      <template v-else>
        <a-form-item label="波特率" v-model="formData.communicationConfig.baudRate">
          <a-input v-model="formData.communicationConfig.baudRate" allow-clear />
        </a-form-item>
        <a-form-item label="数据位" v-model="formData.communicationConfig.dataBits">
          <a-input v-model="formData.communicationConfig.dataBits" allow-clear />
        </a-form-item>
        <a-form-item label="停止位" v-model="formData.communicationConfig.stopBits">
          <a-select v-model="formData.communicationConfig.stopBits" :options="STOP_BITS_OPTIONS" />
        </a-form-item>
        <a-form-item label="奇偶校验" v-model="formData.communicationConfig.parity">
          <a-select v-model="formData.communicationConfig.parity" :options="PARITY_OPTIONS" />
        </a-form-item>
        <a-form-item label="缓冲区字节数" v-model="formData.communicationConfig.bufferBytes">
          <a-input v-model="formData.communicationConfig.bufferBytes" allow-clear />
        </a-form-item>
        <a-form-item label="握手协议" v-model="formData.communicationConfig.handShake">
          <a-select v-model="formData.communicationConfig.handShake" :options="HAND_SHAKE_OPTIONS" />
        </a-form-item>
        <a-form-item label="超时时间" v-model="formData.communicationConfig.timeout">
          <a-input v-model="formData.communicationConfig.timeout" allow-clear />
        </a-form-item>
      </template>
    </template>
  </a-form>
</template>

<script setup lang="ts">
import type { ConfigNodeData } from '../../types';
import type { PropType } from 'vue';
import { CONFIG_TYPE_OPTIONS, COMMUNICATION_TYPE_OPTIONS, PARITY_OPTIONS, HAND_SHAKE_OPTIONS, STOP_BITS_OPTIONS, BOOLEAN_STRING_OPTIONS } from '../../common';

defineProps({
  formData: {
    type: Object as PropType<ConfigNodeData>,
    required: true,
  }
});
</script>

<style scoped lang="scss"></style>