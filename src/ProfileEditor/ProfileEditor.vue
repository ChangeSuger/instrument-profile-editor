<template>
  <div id="profile-editor">
    <div class="control-panel">
      <ControlPanel :lf="lf" />
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
import { v4 as uuidv4 } from 'uuid';
import xml2js from 'xml2js';
import { Message } from '@arco-design/web-vue';

import { InstrumentNode, ModelNode, ConfigNode, OperationNode } from './node';
import { xmlData2ProfileData, profileData2XmlData, adaptorIn, adaptorOut } from './utils/adaptor';
import { NodeType, POSITION_X } from './common';
import type { ConfigType } from './types';

defineExpose({
  dataImport,
  dataExport,
  check,
});

const lf = ref<LogicFlow>();
const nodeEditDrawerRef = ref<InstanceType<typeof NodeEditDrawer>>();
const messageId = uuidv4();

const dataInit = {
  nodes: [
    {
      id: uuidv4(),
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
};

function dataImport(xml: string) {
  const parser = new xml2js.Parser();
  parser.parseString(xml, (err, result) => {
    if (err) {
      Message.error('配置文件解析失败');
      return;
    } else {
      lf.value?.render(adaptorIn(xmlData2ProfileData(result)));
      lf.value?.emit('custom:layout', {});
    }
  });
}

function dataExport() {
  const builder = new xml2js.Builder();
  return builder.buildObject(profileData2XmlData((adaptorOut(lf.value!.getGraphRawData()))));
}

function ErrorMessage(message: string) {
  Message.error({
    id: messageId,
    content: message,
    closable: true,
    duration: 5000,
  });
}

function focusOn(node: LogicFlow.NodeData) {
  lf.value?.resetTranslate();
  lf.value?.translate(0, -node.y + 100);
  lf.value?.graphModel.selectNodeById(node.id);
  // @ts-expect-error 外部手动触发事件，没必要遵守类型
  lf.value?.emit('node:click', { data: node });
}

/**
 * 配置文件逻辑校验，存在错误时会自动聚焦到错误节点
 * @returns 是否存在错误，`true` 为存在错误，`false` 为不存在错误
 */
function check(): boolean {
  const modelNodes: LogicFlow.NodeData[] = [];
  const configNodes: LogicFlow.NodeData[] = [];
  const niVisaOperationNodes: LogicFlow.NodeData[] = [];
  const functionOperationNodes: LogicFlow.NodeData[] = [];
  const customOperationNodes: LogicFlow.NodeData[] = [];
  const nodeMap = new Map<string, LogicFlow.NodeData[]>();

  // 首先校验每个节点的信息是否完整
  const graphData = lf.value!.getGraphRawData();
  for (const node of graphData.nodes) {
    if (node.properties?.type === NodeType.Model) {
      modelNodes.push(node);
    } else if (node.properties?.type === NodeType.Config) {
      configNodes.push(node);
    } else if (node.properties?.type === NodeType.NI_VISA_OPERATION) {
      niVisaOperationNodes.push(node);
    } else if (node.properties?.type === NodeType.FUNCTION_OPERATION) {
      functionOperationNodes.push(node);
    } else if (node.properties?.type === NodeType.CUSTOM_OPERATION) {
      customOperationNodes.push(node);
    }

    const parentId = node.properties?.parentId;
    if (parentId) {
      if (nodeMap.has(parentId)) {
        nodeMap.get(parentId)!.push(node);
      } else {
        nodeMap.set(parentId, [node]);
      }
    }

    if (node.properties?.isError) {
      focusOn(node);
      ErrorMessage('节点信息不完整');
      return true;
    }
  }

  // 型号节点的配置类型是否有对应的配置节点
  for (const modelNode of modelNodes) {
    const configType = modelNode.properties!.configType as ConfigType;
    const configed = nodeMap.get(modelNode.id)?.some(node => {
      return node.properties!.id === configType;
    });

    if (!configed) {
      focusOn(modelNode);
      ErrorMessage('型号节点的配置类型没有对应的配置节点');
      return true;
    }
  }

  // FUNCION 配置节点，`isVisa = 'false'` 时，必须具有一个名为“连接检测”的操作节点
  for (const configNode of configNodes) {
    if (configNode.properties?.id === 'FUNCTION' && configNode.properties?.isVisa === 'false') {
      const hasConnectionChaekNode = nodeMap.get(configNode.id)?.some(node => {
        return node.properties?.id === '连接检测';
      });

      if (!hasConnectionChaekNode) {
        focusOn(configNode);
        ErrorMessage('不支持 VISA 的 FUNCION 配置，必须具有一个名为“连接检测”的操作节点');
        return true;
      }
    }
  }

  // NI-VISA 操作节点校验


  // FUNCTION 操作节点校验


  // CUSTOM 操作节点校验


  return false;
}

onMounted(() => {
  const lfContainer = document.getElementById('lf-container')!;
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
  });
  lf.value.batchRegister([InstrumentNode, ModelNode, ConfigNode, OperationNode]);

  lf.value.on('custom:layout', () => {
    let height = 100;
    const deltaY = 50;
    const graphData = lf.value!.getGraphRawData();
    let startNode: LogicFlow.NodeData = graphData.nodes[0];
    const nodeMap = new Map<string, LogicFlow.NodeData[]>();
    graphData.nodes.forEach((node) => {
      const parentId = node.properties!.parentId;
      if (parentId) {
        if (nodeMap.has(parentId)) {
          nodeMap.get(parentId)!.push(node);
        } else {
          nodeMap.set(parentId, [node]);
        }
      }
      if (node.type === 'instrument-node') {
        startNode = node;
      }
    });

    if (startNode) {
      lf.value!.graphModel.moveNode2Coordinate(startNode.id, POSITION_X['instrument-node'], height);
      nodeMap.get(startNode.id)?.forEach((node, index) => {
        if (index > 0) {
          height += deltaY;
        }
        lf.value!.graphModel.moveNode2Coordinate(node.id, POSITION_X['model-node'], height);

        if (node.properties?.isFloded) {
          return;
        }

        nodeMap.get(node.id)?.forEach((node, index) => {
          if (index > 0) {
            height += deltaY;
          }
          lf.value!.graphModel.moveNode2Coordinate(node.id, POSITION_X['config-node'], height);

          if (node.properties?.isFloded) {
            return;
          }

          nodeMap.get(node.id)?.forEach((node, index) => {
            if (index > 0) {
              height += deltaY;
            }
            lf.value!.graphModel.moveNode2Coordinate(node.id, POSITION_X['operation-node'], height);
          });
        });
      });
    }
  });

  lf.value.on('node:click', ({data}) => {
    nodeEditDrawerRef.value?.openDrawer(data);
  });

  lf.value.on('blank:click', () => {
    nodeEditDrawerRef.value?.closeDrawer();
  });

  lf.value.render(dataInit);
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
