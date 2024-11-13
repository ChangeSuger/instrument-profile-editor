<template>
  <div class="node-wrap">
    <div class="node-title">
      <span class="node-icon">
        <img src="../assets/computer.svg" />
      </span>
      <TypographyParagraph :ellipsis="{ row: 1, showTooltip: true }" class="node-name">
        {{ properties.id || '设备类别' }}
      </TypographyParagraph>
    </div>
    <div class="node-next" :class="{ hidden: !isActive }">
      <CirclePlus class="add-node-icon" @click.stop="addNode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypographyParagraph } from '@arco-design/web-vue'
import { HtmlNodeModel } from '@logicflow/core'
import { computed } from 'vue'
import CirclePlus from '../icons/CirclePlus.vue'
import { NodeType } from '../common'
import { initModelNodeData } from '../utils/inital'

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
})

const isActive = computed(() => props.isHovered || props.isSelected)

function addNode() {
  const nodeId = props.model.id
  const graphModel = props.model.graphModel
  const newNode = graphModel.addNode({
    type: 'model-node',
    x: 350,
    y: 100,
    properties: {
      type: NodeType.Model,
      parentId: nodeId,
      ...initModelNodeData(),
    },
  })
  graphModel.addEdge({
    type: 'polyline',
    sourceNodeId: nodeId,
    targetNodeId: newNode.id,
  })
  graphModel.eventCenter.emit('custom:layout', {})
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

    .node-icon {
      display: inline-block;
      width: 26px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgb(90, 90, 204);

      img {
        width: 14px;
        height: 14px;
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
}
</style>
