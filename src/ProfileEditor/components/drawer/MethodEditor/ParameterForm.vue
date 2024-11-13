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
          <a-input v-model="parameter.value" allow-clear>
            <template #prepend>
              <a-select :style="{ width: '110px' }" v-model="parameter.type">
                <a-option value="System.Boolean">Boolean</a-option>
                <a-option value="System.Char">Char</a-option>
                <a-option value="System.Double">Double</a-option>
                <a-option value="System.Int32">Int32</a-option>
                <a-option value="System.String">String</a-option>
                <a-option value="System.Single">Single</a-option>
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

const props = defineProps({
  parameters: {
    type: Array as PropType<MethodData['parameters']>,
    required: true,
  },
});

function addParameter(index?: number) {
  if (index !== undefined) {
    props.parameters.splice(index + 1, 0, {
      type: 'System.String',
      value: '',
    });
  } else {
    props.parameters.push({
      type: 'System.String',
      value: '',
    });
  }
}

function deleteParameter(index: number) {
  props.parameters.splice(index, 1);
}
</script>

<style scoped lang="scss"></style>