<template>
  <div id="profile-editor">
    <div class="control-panel">
      <ControlPanel />
    </div>
    <div id="lf-container"></div>
  </div>
</template>

<script setup lang="ts">
import ControlPanel from './ControlPanel.vue';

import { ref, onMounted } from 'vue';
import LogicFlow from '@logicflow/core';
import "@logicflow/core/lib/style/index.css";

import { InstrumentNode, ModelNode, ConfigNode, OperationNode } from './node';

import { NodeType } from './common';

const lf = ref<LogicFlow>();

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
      }
    },
  ],
  edges: [],
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
    // hideAnchors: true,
    nodeTextEdit: false,
    edgeTextEdit: false,
    textEdit: false,
  });
  lf.value.batchRegister([InstrumentNode, ModelNode, ConfigNode, OperationNode]);
  lf.value.render(data);
});
</script>

<style scoped lang="scss">
#profile-editor {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-panel {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 1;
}

#lf-container {
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss">
.lf-anchor {
  display: none;
}
foreignObject {
  overflow: visible;
}
</style>