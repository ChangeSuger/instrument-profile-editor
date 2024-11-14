<template>
  <a-space direction="vertical" fill>
    <a-list size="small" v-if="parameters.length">
      <a-list-item v-for="(parameter, index) in props.parameters" :key="index">
        <template #actions>
          <a-button-group type="text" size="mini">
            <a-button @click="addParameter(index)">
              <template #icon>
                <IconPlus />
              </template>
            </a-button>
            <a-button @click="deleteParameter(index)" status="danger">
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
          </a-button-group>
        </template>
        <a-space>
          <a-input v-model="parameter.value" allow-clear size="mini">
            <template #prepend>
              <a-select :style="{ width: '100px' }" v-model="parameter.type" size="mini">
                <a-option v-for="option in PARAMETER_TYPE_OPTIONS" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-option>
              </a-select>
            </template>
          </a-input>
        </a-space>
      </a-list-item>
    </a-list>
    <a-button type="text" @click="addParameter()" size="small">
      <template #icon>
        <IconPlus />
      </template>
      新增参数
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { MethodData } from '../../../types';
import { IconDelete, IconPlus } from '@arco-design/web-vue/es/icon';
import { PARAMETER_TYPE_OPTIONS } from '../../../common';

const props = defineProps({
  parameters: {
    type: Array as PropType<MethodData['parameters']>,
    required: true,
  },
});

function getParameterDataInit() {
  return {
    type: 'System.String',
    value: '',
  };
}

function addParameter(index?: number) {
  if (index !== undefined) {
    props.parameters.splice(index + 1, 0, getParameterDataInit());
  } else {
    props.parameters.push(getParameterDataInit());
  }
}

function deleteParameter(index: number) {
  props.parameters.splice(index, 1);
}
</script>

<style scoped lang="scss"></style>