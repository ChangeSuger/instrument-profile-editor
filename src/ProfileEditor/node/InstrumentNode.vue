<template>
  <div class="node-wrap">
    <div class="node-title" :class="{ error: isError }">
      <span class="node-icon">
        <img src="../assets/computer.svg" />
      </span>
      <TypographyParagraph :ellipsis="{ row: 1, showTooltip: true }" class="node-name">
        {{ properties.id || '设备类别' }}
      </TypographyParagraph>
    </div>
    <div class="node-next" :class="{ hidden: !isActive }">
      <Tooltip content="添加型号节点">
        <CirclePlus class="add-node-icon" @click.stop="addNode" />
      </Tooltip>
    </div>
    <div class="error-info" v-if="isError && isActive">
      {{ errorInfo }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypographyParagraph, Tooltip } from '@arco-design/web-vue';
import { HtmlNodeModel } from '@logicflow/core';
import { computed, watch } from 'vue';
import CirclePlus from '../icons/CirclePlus.vue';
import { NodeType } from '../common';
import { initModelNodeData } from '../utils/inital';

const props = defineProps({
  properties: {
    type: Object,
    required: true,
  },
  model: {
    type: HtmlNodeModel,
    required: true,
  },
  isSelected: Boolean,
  isHovered: Boolean,
});

const isActive = computed(() => props.isHovered || props.isSelected);
const isError = computed(() => props.properties.id === '');

const errorInfo = '信息不完整';

watch(() => isError.value, (value) => {
  props.model.setProperty('isError', value);
}, { immediate: true });

function addNode() {
  const nodeId = props.model.id;
  const graphModel = props.model.graphModel;
  const newNode = graphModel.addNode({
    type: 'model-node',
    x: 350,
    y: 100,
    properties: {
      type: NodeType.Model,
      parentId: nodeId,
      ...initModelNodeData(),
    },
  });
  graphModel.addEdge({
    type: 'polyline',
    sourceNodeId: nodeId,
    targetNodeId: newNode.id,
  });
  graphModel.clearSelectElements();
  newNode.setSelected(true);
  // @ts-expect-error 外部手动触发事件，没必要遵守类型
  graphModel.eventCenter.emit('node:click', { data: newNode.getData() });
  graphModel.eventCenter.emit('custom:layout', {});
}
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
      background: rgb(90, 90, 204);

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

  .node-next {
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    transform: translateX(100%);
    padding-left: 5px;

    &.hidden {
      display: none;
    }

    .add-node-icon {
      width: 30px;
      height: 30px;
      fill: rgb(146, 198, 146);
      stroke: white;

      &:hover {
        fill: rgb(27, 130, 27);
      }
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
