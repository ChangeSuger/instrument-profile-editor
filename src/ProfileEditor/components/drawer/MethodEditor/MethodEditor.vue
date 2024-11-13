<template>
  <a-space direction="vertical">
    <div class="method-editor-title">方法</div>
    <a-collapse v-if="methods.length">
      <a-collapse-item v-for="(method, index) in methods" :key="index">
        <template #header>
          <a-input :style="{ width: '200px' }" v-model="method.name" allow-clear @click.stop />
        </template>
        <template #extra>
          <a-button-group type="text" size="mini">
            <a-button @click.stop="addMethod(index)">
              <template #icon>
                <IconPlus />
              </template>
            </a-button>
            <a-button @click.stop="moveUpMethod(index)" :disabled="index === 0">
              <template #icon>
                <IconArrowUp />
              </template>
            </a-button>
            <a-button @click.stop="moveDownMethod(index)" :disabled="index === methods.length - 1">
              <template #icon>
                <IconArrowDown />
              </template>
            </a-button>
            <a-button @click.stop="removeMethod(index)" status="danger">
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
          </a-button-group>
        </template>

        <ParameterForm :parameters="method.parameters" />
      </a-collapse-item>
    </a-collapse>
    <a-button type="text" @click="addMethod()">
      <template #icon>
        <IconPlus />
      </template>
      新增方法
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { MethodData } from '../../../types';
import { IconDelete, IconPlus, IconArrowUp, IconArrowDown } from '@arco-design/web-vue/es/icon';
import ParameterForm from './ParameterForm.vue';

const props = defineProps({
  methods: {
    type: Array as PropType<MethodData[]>,
    required: true,
  },
});

function addMethod(index?: number) {
  if (index !== undefined) {
    props.methods.splice(index + 1, 0, {
      name: '',
      parameters: [],
    });
  } else {
    props.methods.push({
      name: '',
      parameters: [],
    });
  }
}

function moveUpMethod(index: number) {
  if (index === 0) {
    return;
  }
  const method = props.methods[index];
  props.methods.splice(index, 1);
  props.methods.splice(index - 1, 0, method);
}

function moveDownMethod(index: number) {
  if (index === props.methods.length - 1) {
    return;
  }
  const method = props.methods[index];
  props.methods.splice(index, 1);
  props.methods.splice(index + 1, 0, method);
}

function removeMethod(index: number) {
  props.methods.splice(index, 1);
}

</script>

<style scoped lang="scss">
.method-editor-title {
  font-size: 20px;
  font-weight: bold;
}
</style>