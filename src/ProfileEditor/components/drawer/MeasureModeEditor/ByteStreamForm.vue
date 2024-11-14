<template>
  <a-space direction="vertical" fill>
    <a-list size="small" v-if="byteStreams.length">
      <a-list-item v-for="(byteStream, index) in props.byteStreams" :key="index">
        <template #actions>
          <a-button-group type="text" size="mini">
            <a-button @click="addByteStream(index)">
              <template #icon>
                <IconPlus />
              </template>
            </a-button>
            <a-button @click="deleteByteStream(index)" status="danger">
              <template #icon>
                <IconDelete />
              </template>
            </a-button>
          </a-button-group>
        </template>
        <a-space :size="0">
          <a-input v-model="byteStream.send" allow-clear size="mini">
            <template #prepend>
              发送
            </template>
          </a-input>
          <a-input v-model="byteStream.receive" allow-clear size="mini">
            <template #prepend>
              接收
            </template>
          </a-input>
        </a-space>
      </a-list-item>
    </a-list>
    <a-button type="text" @click="addByteStream()" size="small">
      <template #icon>
        <IconPlus />
      </template>
      新增字节流
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { ByteStream } from '../../../types';
import { IconDelete, IconPlus } from '@arco-design/web-vue/es/icon';

const props = defineProps({
  byteStreams: {
    type: Array as PropType<ByteStream[]>,
    required: true,
  },
});

function getByteStreamDataInit() {
  return {
    send: '0x00',
    receive: '0x00',
  };
}

function addByteStream(index?: number) {
  if (index !== undefined) {
    props.byteStreams.splice(index + 1, 0, getByteStreamDataInit());
  } else {
    props.byteStreams.push(getByteStreamDataInit());
  }
}

function deleteByteStream(index: number) {
  props.byteStreams.splice(index, 1);
}
</script>

<style scoped lang="scss"></style>