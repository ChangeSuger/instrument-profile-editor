<template>
  <div class="node-wrap">
    <div class="node-title" :class="{ error: isError }">
      <span class="node-icon">
        <img src="../assets/zap.svg" />
      </span>
      <TypographyParagraph :ellipsis="{ row: 1, showTooltip: true }" class="node-name">
        {{ properties.id || '操作' }}
      </TypographyParagraph>
    </div>

    <div class="error-info" v-if="isError && isActive">
      {{ errorInfo }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypographyParagraph } from '@arco-design/web-vue';
import { BaseNodeModel } from '@logicflow/core';
import { computed, watch } from 'vue';
import { OPERATION_NODE_TYPE_MAP } from '../common';

const props = defineProps({
  properties: {
    type: Object,
    required: true,
  },
  model: {
    type: BaseNodeModel,
    required: true,
  },
  isSelected: Boolean,
  isHovered: Boolean,
});

const isActive = computed(() => props.isHovered || props.isSelected);
const isError = computed(() => {
  if (props.properties.type === OPERATION_NODE_TYPE_MAP['NI-VISA']) {
    return (
      props.properties.id === '' ||
      props.properties.command === ''
    );
  } else if (props.properties.type === OPERATION_NODE_TYPE_MAP['FUNCTION']) {
    return props.properties.id === '';
  } else {
    return props.properties.id === '';
  }
});

const errorInfo = '信息不完整';

watch(() => isError.value, (value) => {
  props.model.setProperty('isError', value);
}, { immediate: true });
</script>

<style scoped lang="scss">
.node-wrap {
  width: 100%;
  height: 100%;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .node-title {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    border: 1px solid #bac1d0;
    border-radius: 4px;
    background: #fff;
    overflow: hidden;

    &.error {
      border: 3px dashed rgb(220, 16, 16);
    }

    .node-icon {
      display: inline-block;
      width: 26px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgb(90, 204, 109);

      img {
        width: 18px;
        height: 18px;
        filter: drop-shadow(#ffffff 100px 0);
        transform: translateX(-100px);
      }
    }

    .node-name {
      width: 0px;
      margin-bottom: 0px;
      flex: 1;
      text-align: center;
    }
  }

  .error-info {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    color: red;
    text-align: center;
    transform: translateY(105%);
  }
}
</style>
