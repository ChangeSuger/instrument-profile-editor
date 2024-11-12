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

const lf = ref<LogicFlow>();

const data = {
  nodes: [
    {
      id: '21',
      type: 'rect',
      x: 100,
      y: 200,
      text: 'rect node',
    },
    {
      id: '50',
      type: 'circle',
      x: 300,
      y: 400,
      text: 'circle node',
    },
  ],
  edges: [
    {
      type: 'polyline',
      sourceNodeId: '50',
      targetNodeId: '21',
    },
  ],
}

onMounted(() => {
  const lfContainer = document.getElementById('lf-container')!;
  lf.value = new LogicFlow({
    container: lfContainer,
    stopScrollGraph: false,
    stopZoomGraph: false,
    grid: false,
  });
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