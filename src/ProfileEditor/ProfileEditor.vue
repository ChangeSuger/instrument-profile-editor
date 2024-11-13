<template>
  <div id="profile-editor">
    <div class="control-panel">
      <ControlPanel />
    </div>
    <div id="lf-container"></div>
    <NodeEditDrawer :lf="lf" ref="nodeEditDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import ControlPanel from './components/ControlPanel.vue';
import NodeEditDrawer from './components/drawer/NodeEditDrawer.vue';

import { ref, onMounted } from 'vue';
import LogicFlow from '@logicflow/core';
import '@logicflow/core/lib/style/index.css';

import { InstrumentNode, ModelNode, ConfigNode, OperationNode } from './node';

import { NodeType, POSITION_X } from './common';

const lf = ref<LogicFlow>()
const nodeEditDrawerRef = ref<InstanceType<typeof NodeEditDrawer>>();

const data = {
  nodes: [
    {
      id: '11',
      type: 'instrument-node',
      x: 100,
      y: 100,
      properties: {
        type: NodeType.Instrument,
        id: '',
      },
    },
  ],
  edges: [],
}

onMounted(() => {
  const lfContainer = document.getElementById('lf-container')!
  lf.value = new LogicFlow({
    container: lfContainer,
    stopScrollGraph: false,
    stopZoomGraph: false,
    grid: false,
    adjustEdge: false,
    adjustNodePosition: false,
    nodeTextEdit: false,
    edgeTextEdit: false,
    textEdit: false,
  })
  lf.value.batchRegister([InstrumentNode, ModelNode, ConfigNode, OperationNode])

  lf.value.on('custom:layout', () => {
    let height = 100
    const deltaY = 60
    const graphData = lf.value!.getGraphRawData()
    let startNode: LogicFlow.NodeData = graphData.nodes[0]
    const nodeMap = new Map<string, LogicFlow.NodeData[]>()
    graphData.nodes.forEach((node) => {
      const parentId = node.properties!.parentId
      if (parentId) {
        if (nodeMap.has(parentId)) {
          nodeMap.get(parentId)!.push(node)
        } else {
          nodeMap.set(parentId, [node])
        }
      }
      if (node.type === 'instrument-node') {
        startNode = node
      }
    })

    if (startNode) {
      lf.value!.graphModel.moveNode2Coordinate(startNode.id, POSITION_X['instrument-node'], height)
      nodeMap.get(startNode.id)?.forEach((node, index) => {
        if (index > 0) {
          height += deltaY
        }
        lf.value!.graphModel.moveNode2Coordinate(node.id, POSITION_X['model-node'], height)

        nodeMap.get(node.id)?.forEach((node, index) => {
          if (index > 0) {
            height += deltaY
          }
          lf.value!.graphModel.moveNode2Coordinate(node.id, POSITION_X['config-node'], height)

          nodeMap.get(node.id)?.forEach((node, index) => {
            if (index > 0) {
              height += deltaY
            }
            lf.value!.graphModel.moveNode2Coordinate(node.id, POSITION_X['operation-node'], height)
          })
        })
      })
    }
  });

  lf.value.on('node:click', ({data}) => {
    nodeEditDrawerRef.value?.openDrawer(data);
  });

  lf.value.on('blank:click', () => {
    nodeEditDrawerRef.value?.closeDrawer();
  });

  lf.value.render(data);
});
</script>

<style scoped lang="scss">
#profile-editor {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4E5969;
}

.control-panel {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
}

#lf-container {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
#profile-editor {
  .lf-anchor {
    display: none;
  }
  foreignObject {
    overflow: visible;
  }
  .lf-edge {
    pointer-events: none;
  }
  .arco-collapse-item-content {
    padding-left: 6px;
    padding-right: 6px;
  }

  ::-webkit-scrollbar {
    border-radius: 1rem;
    background: transparent;
    width: 0.65rem;
  }

  ::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 0.65rem;
    background: gray;
    background-clip: content-box;

    &:hover {
      background: gray;
    }
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
}
</style>
