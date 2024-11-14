<template>
  <a-space direction="vertical">
    <div class="measure-mode-editor-title">测量模式</div>
    <a-collapse v-if="measureModes.length">
      <a-collapse-item v-for="(measureMode, index) in measureModes" :key="index">
        <template #header>
          <a-input :style="{ width: '200px' }" v-model="measureMode.id" allow-clear @click.stop>
            <template #prepend>
              测量模式
            </template>
          </a-input>
        </template>
        <template #extra>
          <a-button-group type="text" size="mini">
            <a-button @click.stop="addMeasureMode(index)">
              <template #icon>
                <IconPlus />
              </template>
            </a-button>
            <a-button @click.stop="moveUpMeasureMode(index)" :disabled="index === 0">
              <template #icon>
                <IconArrowUp />
              </template>
            </a-button>
            <a-button @click.stop="moveDownMeasureMode(index)" :disabled="index === measureModes.length - 1">
              <template #icon>
                <IconArrowDown />
              </template>
            </a-button>
            <a-button @click.stop="removeMeasureMode(index)" status="danger">
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
          </a-button-group>
        </template>

        <WorkPlaceList :workplaces="measureMode.workplaces" />
      </a-collapse-item>
    </a-collapse>
    <a-button type="text" @click="addMeasureMode()">
      <template #icon>
        <IconPlus />
      </template>
      新增测量模式
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { MeasureMode } from '../../../types';
import { IconDelete, IconPlus, IconArrowUp, IconArrowDown } from '@arco-design/web-vue/es/icon';
import WorkPlaceList from './WorkPlaceList.vue';

const props = defineProps({
  measureModes: {
    type: Array as PropType<MeasureMode[]>,
    required: true,
  },
});

function getMeasureModeDataInit(): MeasureMode {
  return {
    id: '',
    workplaces: [],
  };
}

function addMeasureMode(index?: number) {
  if (index !== undefined) {
    props.measureModes.splice(index + 1, 0, getMeasureModeDataInit());
  } else {
    props.measureModes.push(getMeasureModeDataInit());
  }
}

function moveUpMeasureMode(index: number) {
  if (index === 0) {
    return;
  }
  const measureMode = props.measureModes[index];
  props.measureModes.splice(index, 1);
  props.measureModes.splice(index - 1, 0, measureMode);
}

function moveDownMeasureMode(index: number) {
  if (index === props.measureModes.length - 1) {
    return;
  }
  const measureMode = props.measureModes[index];
  props.measureModes.splice(index, 1);
  props.measureModes.splice(index + 1, 0, measureMode);
}

function removeMeasureMode(index: number) {
  props.measureModes.splice(index, 1);
}
</script>

<style scoped lang="scss">
.measure-mode-editor-title {
  font-size: 20px;
  font-weight: bold;
}
</style>