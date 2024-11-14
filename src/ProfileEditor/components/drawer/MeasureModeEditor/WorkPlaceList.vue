<template>
  <a-space direction="vertical" fill>
    <a-collapse v-if="workplaces.length">
      <a-collapse-item v-for="(workplace, index) in workplaces" :key="index">
        <template #header>
          <a-input :style="{ width: '180px' }" v-model="workplace.id" allow-clear @click.stop size="small">
            <template #prepend>
              工位
            </template>
          </a-input>
        </template>
        <template #extra>
          <a-button-group type="text" size="mini">
            <a-button @click.stop="addWorkplace(index)">
              <template #icon>
                <IconPlus />
              </template>
            </a-button>
            <a-button @click.stop="moveUpWorkplace(index)" :disabled="index === 0">
              <template #icon>
                <IconArrowUp />
              </template>
            </a-button>
            <a-button @click.stop="moveDownWorkplace(index)" :disabled="index === workplaces.length - 1">
              <template #icon>
                <IconArrowDown />
              </template>
            </a-button>
            <a-button @click.stop="removeWorkplace(index)" status="danger">
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
          </a-button-group>
        </template>

        <ByteStreamForm :byteStreams="workplace.byteStreams" />
      </a-collapse-item>
    </a-collapse>
    <a-button type="text" @click="addWorkplace()">
      <template #icon>
        <IconPlus />
      </template>
      新增工位
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { Workplace } from '../../../types';
import { IconDelete, IconPlus, IconArrowUp, IconArrowDown } from '@arco-design/web-vue/es/icon';
import ByteStreamForm from './ByteStreamForm.vue';


const props = defineProps({
  workplaces: {
    type: Array as PropType<Workplace[]>,
    required: true,
  },
});

function addWorkplace(index?: number) {
  if (index !== undefined) {
    props.workplaces.splice(index + 1, 0, {
      id: '',
      byteStreams: [],
    });
  } else {
    props.workplaces.push({
      id: '',
      byteStreams: [],
    });
  }
}

function moveUpWorkplace(index: number) {
  if (index === 0) {
    return;
  }
  const workplace = props.workplaces[index];
  props.workplaces.splice(index, 1);
  props.workplaces.splice(index - 1, 0, workplace);
}

function moveDownWorkplace(index: number) {
  if (index === props.workplaces.length - 1) {
    return;
  }
  const workplace = props.workplaces[index];
  props.workplaces.splice(index, 1);
  props.workplaces.splice(index + 1, 0, workplace);
}

function removeWorkplace(index: number) {
  props.workplaces.splice(index, 1);
}
</script>