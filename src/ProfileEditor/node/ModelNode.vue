<template>
  <div class="node-wrap" :class="{ hovered: isHovered, selected: isSelected }">
    <div class="node-title">
      <span class="node-icon">
        <img src="../assets/database.svg" />
      </span>
      <TypographyParagraph :ellipsis="{ row: 1, showTooltip: true }" class="node-name">
        {{ properties.id || '型号' }}
      </TypographyParagraph>
    </div>
    <div class="node-next" :class="{ hidden: !isActive && !isFloded }">
      <template v-if="isFloded">
        <div class="vertical-line">
          <div class="line"></div>
        </div>
        <Tooltip content="展开">
          <ArrowLeft class="unflod-node-icon" @click.stop="unflodNode" />
        </Tooltip>
      </template>
      <template v-else>
        <Tooltip content="添加配置节点">
          <CirclePlus class="add-node-icon" @click.stop="addNode" />
        </Tooltip>
        <Tooltip content="折叠">
          <ArrowLeft v-if="hasChild" class="flod-node-icon" @click.stop="flodNode" />
        </Tooltip>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypographyParagraph, Tooltip } from '@arco-design/web-vue'
import { HtmlNodeModel } from '@logicflow/core'
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import CirclePlus from '../icons/CirclePlus.vue'
import ArrowLeft from '../icons/ArrowLeft.vue'
import { NodeType } from '../common'
import { initConfigNodeData } from '../utils/inital'

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
  isFloded: Boolean,
})

const isActive = computed(() => props.isHovered || props.isSelected)
const hasChild = ref(false);

function addNode() {
  const nodeId = props.model.id
  const graphModel = props.model.graphModel
  const newNode = graphModel.addNode({
    type: 'config-node',
    x: 600,
    y: 100,
    properties: {
      type: NodeType.Config,
      parentId: nodeId,
      ...initConfigNodeData(),
    },
  })
  graphModel.addEdge({
    type: 'polyline',
    sourceNodeId: nodeId,
    targetNodeId: newNode.id,
  })
  graphModel.clearSelectElements();
  newNode.setSelected(true);
  // @ts-expect-error 外部手动触发事件，没必要遵守类型
  graphModel.eventCenter.emit('node:click', { data: newNode.getData() })
  graphModel.eventCenter.emit('custom:layout', {})
}

function flodNode() {
  props.model.setProperty('isFloded', true);
  const nodeId = props.model.id
  const graphModel = props.model.graphModel
  const nodes = graphModel.getNodeOutgoingNode(nodeId)
  const edges = graphModel.getNodeOutgoingEdge(nodeId)
  for (const node of nodes) {
    node.visible = false;
    // 进一步折叠配置节点
    if (node.properties.isFloded) {
      continue;
    }
    const nodes = graphModel.getNodeOutgoingNode(node.id)
    const edges = graphModel.getNodeOutgoingEdge(node.id)
    for (const node of nodes) {
      node.visible = false;
    }
    for (const edge of edges) {
      edge.visible = false;
    }
  }
  for (const edge of edges) {
    edge.visible = false;
  }
  graphModel.eventCenter.emit('custom:layout', {})
}

function unflodNode() {
  props.model.setProperty('isFloded', false);
  const nodeId = props.model.id
  const graphModel = props.model.graphModel
  const nodes = graphModel.getNodeOutgoingNode(nodeId)
  const edges = graphModel.getNodeOutgoingEdge(nodeId)
  for (const node of nodes) {
    node.visible = true;
    // 进一步展开配置节点
    if (node.properties.isFloded) {
      continue;
    }
    const nodes = graphModel.getNodeOutgoingNode(node.id)
    const edges = graphModel.getNodeOutgoingEdge(node.id)
    for (const node of nodes) {
      node.visible = true;
    }
    for (const edge of edges) {
      edge.visible = true;
    }
  }
  for (const edge of edges) {
    edge.visible = true;
  }
  graphModel.eventCenter.emit('custom:layout', {})
}

function updateHasChild() {
  const graphModel = props.model.graphModel;
  const nodeId = props.model.id;
  const childs = graphModel.getNodeOutgoingNode(nodeId);
  hasChild.value = childs.length > 0;
}

onMounted(() => {
  updateHasChild();
  props.model.graphModel.eventCenter.on('edge:add', updateHasChild)
  props.model.graphModel.eventCenter.on('node:delete', updateHasChild)
})

onBeforeUnmount(() => {
  props.model.graphModel.eventCenter.off('edge:add', updateHasChild)
  props.model.graphModel.eventCenter.off('node:delete', updateHasChild)
})
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
      background: rgb(204, 166, 90);

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

    .flod-node-icon {
      width: 30px;
      height: 30px;
      fill: rgb(146, 198, 146);
      stroke: white;

      &:hover {
        fill: rgb(27, 130, 27);
      }
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

    .vertical-line {
      width: 30px;
      height: 30px;
      position: relative;

      .line {
        position: absolute;
        top: 13px;
        left: -5px;
        width: 40px;
        height: 0px;
        border: 2px solid #000000;
      }
    }

    .unflod-node-icon {
      width: 30px;
      height: 30px;
      fill: rgb(146, 198, 146);
      stroke: white;
      transform: rotate(180deg);

      &:hover {
        fill: rgb(27, 130, 27);
      }
    }
  }
}
</style>
