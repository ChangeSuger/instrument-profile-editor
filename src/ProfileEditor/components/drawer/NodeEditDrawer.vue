<template>
  <div class="node-editor-drawer" :class="{ hidden: !visible }">
    <div class="node-editor-drawer-header">
      <span class="node-editor-drawer-title">节点编辑</span>
      <a-popconfirm
        v-if="nodeType !== NodeType.Instrument"
        type="warning"
        content="确定删除该节点？"
        ok-text="删除"
        :ok-button-props="{ status: 'danger' }"
        cancel-text="取消"
      >
        <a-button size="small" status="danger">
          <template #icon>
            <IconDelete />
          </template>
          删除节点
        </a-button>
      </a-popconfirm>
    </div>

    <div class="node-editor-drawer-body">
      <InstrumentNodeForm
        v-if="nodeType === NodeType.Instrument"
        v-model:formData="(nodeData!.properties as InstrumentNodeData)"
      />

      <ModelNodeForm
        v-else-if="nodeType === NodeType.Model"
        v-model:formData="(nodeData!.properties as ModelNodeData)"
      />

      <ConfigNodeForm
        v-else-if="nodeType === NodeType.Config"
        v-model:formData="(nodeData!.properties as ConfigNodeData)"
      />

      <NiVisaOperationNodeForm
        v-else-if="nodeType === NodeType.NI_VISA_OPERATION"
        v-model:formData="(nodeData!.properties as OperationNodeData)"
      />

      <FunctionOperationNodeForm
        v-else-if="nodeType === NodeType.FUNCTION_OPERATION"
        v-model:formData="(nodeData!.properties as OperationNodeData)"
      />

      <CustomOperationNodeForm
        v-else-if="nodeType === NodeType.CUSTOM_OPERATION"
        v-model:formData="(nodeData!.properties as OperationNodeData)"
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
import { NodeType } from '@/ProfileEditor/common';
import { IconDelete } from '@arco-design/web-vue/es/icon';

import InstrumentNodeForm from './InstrumentNodeForm.vue';
import ModelNodeForm from './ModelNodeForm.vue';
import ConfigNodeForm from './ConfigNodeForm.vue';
import NiVisaOperationNodeForm from './NiVisaOperationNodeForm.vue';
import FunctionOperationNodeForm from './FunctionOperationNodeForm.vue';
import CustomOperationNodeForm from './CustomOperationNodeForm.vue';

import type { InstrumentNodeData, ModelNodeData, ConfigNodeData, OperationNodeData } from '@/ProfileEditor/types';

const props = defineProps({
  lf: LogicFlow,
});

defineExpose({
  openDrawer,
  closeDrawer,
});

const nodeData = ref<LogicFlow.NodeData>();

const nodeType = computed(() => {
  return nodeData.value?.properties?.type;
});

const visible = ref(false);

function openDrawer(data: LogicFlow.NodeData) {
  nodeData.value = data;
  visible.value = true;
};

function closeDrawer() {
  visible.value = false;
}

function handleConfirm() {
  props.lf!.setProperties(nodeData.value!.id, nodeData.value!.properties!);
  closeDrawer();
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
  border: 2px solid #d3d3d3;

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
    flex: 1;
    overflow: auto;
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