<template>
  <div class="node-editor-drawer" :class="{ hidden: !visible }">
    <div class="node-editor-drawer-header">
      <span class="node-editor-drawer-title">{{ drawerTitle }}</span>
      <a-space>
        <a-button
          v-if="[NodeType.CUSTOM_OPERATION, NodeType.FUNCTION_OPERATION, NodeType.NI_VISA_OPERATION].includes(nodeType)"
          size="small"
          @click="douplicateNode"
        >
          <template #icon>
            <IconCopy />
          </template>
          复用节点
        </a-button>
        <a-popconfirm
          v-if="nodeType !== NodeType.Instrument"
          position="left"
          type="warning"
          content="确定删除该节点？"
          ok-text="删除"
          :ok-button-props="{ status: 'danger' }"
          cancel-text="取消"
          @ok="handleDeleteNode(nodeData!.id, nodeData!.type)"
        >
          <a-button size="small" status="danger">
            <template #icon>
              <IconDelete />
            </template>
            删除节点
          </a-button>
        </a-popconfirm>
      </a-space>
    </div>

    <div class="node-editor-drawer-body">
      <InstrumentNodeForm
        v-if="nodeType === NodeType.Instrument"
        :formData="(nodeData!.properties as InstrumentNodeData)"
        ref="instrumentNodeFormRef"
      />

      <ModelNodeForm
        v-else-if="nodeType === NodeType.Model"
        :formData="(nodeData!.properties as ModelNodeData)"
        ref="modelNodeFormRef"
      />

      <ConfigNodeForm
        v-else-if="nodeType === NodeType.Config"
        :formData="(nodeData!.properties as ConfigNodeData)"
        ref="configNodeFormRef"
      />

      <NiVisaOperationNodeForm
        v-else-if="nodeType === NodeType.NI_VISA_OPERATION"
        :formData="(nodeData!.properties as OperationNodeData)"
        ref="niVisaOperationNodeFormRef"
      />

      <FunctionOperationNodeForm
        v-else-if="nodeType === NodeType.FUNCTION_OPERATION"
        :formData="(nodeData!.properties as OperationNodeData)"
        ref="functionOperationNodeFormRef"
      />

      <CustomOperationNodeForm
        v-else-if="nodeType === NodeType.CUSTOM_OPERATION"
        :formData="(nodeData!.properties as OperationNodeData)"
        ref="customOperationNodeFormRef"
      />
    </div>

    <a-space class="node-editor-drawer-footer">
      <a-button @click="closeDrawer">取消</a-button>
      <a-button type="primary" @click="handleConfirm">确定</a-button>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LogicFlow from '@logicflow/core';
import { NodeType } from '../../common';
import { IconDelete, IconCopy } from '@arco-design/web-vue/es/icon';
import { cloneDeep } from 'lodash-es';

import InstrumentNodeForm from './InstrumentNodeForm.vue';
import ModelNodeForm from './ModelNodeForm.vue';
import ConfigNodeForm from './ConfigNodeForm.vue';
import NiVisaOperationNodeForm from './NiVisaOperationNodeForm.vue';
import FunctionOperationNodeForm from './FunctionOperationNodeForm.vue';
import CustomOperationNodeForm from './CustomOperationNodeForm.vue';

import type {
  InstrumentNodeData,
  ModelNodeData,
  ConfigNodeData,
  OperationNodeData,
} from '../../types';

const props = defineProps({
  lf: LogicFlow,
});

defineExpose({
  openDrawer,
  closeDrawer,
});

const nodeData = ref<LogicFlow.NodeData>();

const instrumentNodeFormRef = ref<InstanceType<typeof InstrumentNodeForm>>();
const modelNodeFormRef = ref<InstanceType<typeof ModelNodeForm>>();
const configNodeFormRef = ref<InstanceType<typeof ConfigNodeForm>>();
const niVisaOperationNodeFormRef = ref<InstanceType<typeof NiVisaOperationNodeForm>>();
const functionOperationNodeFormRef = ref<InstanceType<typeof FunctionOperationNodeForm>>();
const customOperationNodeFormRef = ref<InstanceType<typeof CustomOperationNodeForm>>();

const nodeType = computed(() => {
  return nodeData.value?.properties?.type;
});

const drawerTitle = computed(() => {
  if (nodeType.value === NodeType.Instrument) {
    return '设备节点编辑';
  } else if (nodeType.value === NodeType.Model) {
    return '型号节点编辑';
  } else if (nodeType.value === NodeType.Config) {
    return '配置节点编辑';
  } else if (nodeType.value === NodeType.NI_VISA_OPERATION) {
    return '操作节点编辑';
  } else if (nodeType.value === NodeType.FUNCTION_OPERATION) {
    return '操作节点编辑';
  } else if (nodeType.value === NodeType.CUSTOM_OPERATION) {
    return '操作节点编辑';
  }
  return '节点编辑';
});

const visible = ref(false);

function openDrawer(data: LogicFlow.NodeData) {
  nodeData.value = data;
  visible.value = true;
}

function closeDrawer() {
  visible.value = false;
}

async function validate() {
  if (nodeType.value === NodeType.Instrument) {
    return instrumentNodeFormRef.value?.validate();
  } else if (nodeType.value === NodeType.Model) {
    return modelNodeFormRef.value?.validate();
  } else if (nodeType.value === NodeType.Config) {
    return configNodeFormRef.value?.validate();
  } else if (nodeType.value === NodeType.NI_VISA_OPERATION) {
    return niVisaOperationNodeFormRef.value?.validate();
  } else if (nodeType.value === NodeType.FUNCTION_OPERATION) {
    return functionOperationNodeFormRef.value?.validate();
  } else if (nodeType.value === NodeType.CUSTOM_OPERATION) {
    return customOperationNodeFormRef.value?.validate();
  }
  return true;
}

async function handleConfirm() {
  const error = await validate();
  if (error) {
    return;
  }
  props.lf!.setProperties(nodeData.value!.id, nodeData.value!.properties!);
  closeDrawer();
}

function handleDeleteNode(nodeId: string, nodeType: string, deepth = 0) {
  if (nodeType !== 'operation-node') {
    for (const childNode of props.lf!.getNodeOutgoingNode(nodeId)) {
      handleDeleteNode(childNode.id, childNode.type, deepth + 1);
    }
  }
  props.lf!.deleteNode(nodeId);
  if (deepth === 0) {
    closeDrawer();
    props.lf!.emit('custom:layout', {});
  }
}

function douplicateNode() {
  const properties = cloneDeep(nodeData.value!.properties);
  const newNode = props.lf!.addNode({
    type: 'operation-node',
    x: 850,
    y: 100,
    properties,
  });
  props.lf!.addEdge({
    type: 'polyline',
    sourceNodeId: properties!.parentId,
    targetNodeId: newNode.id,
  });
  props.lf!.emit('custom:layout', {});
}
</script>

<style scoped lang="scss">
.node-editor-drawer {
  width: 450px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  border-left: 2px solid #d3d3d3;
  background-color: #fffefe;
  z-index: 10;

  .node-editor-drawer-header {
    height: 50px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #f0f0f0;

    .node-editor-drawer-title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .node-editor-drawer-body {
    height: 0px;
    padding: 1rem;
    padding-right: 0.5rem;
    flex: 1;
    overflow-y: scroll;
  }

  .node-editor-drawer-footer {
    padding: 1rem;
    border-top: 2px solid #f0f0f0;
  }
}

.hidden {
  display: none;
}
</style>
