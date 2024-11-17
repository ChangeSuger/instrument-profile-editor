<template>
  <a-space class="control-button-container">
    <a-button class="control-button" @click="handleImport">
      <img class="control-button-icon" src="../assets/import.svg" />
      <span class="control-button-text">导入</span>
    </a-button>
    <a-button class="control-button" @click="handleExport">
      <img class="control-button-icon" src="../assets/download.svg" />
      <span class="control-button-text">导出</span>
    </a-button>
    <a-button class="control-button" @click="handleZoomIn">
      <img class="control-button-icon" src="../assets/zoom-in.svg" />
      <span class="control-button-text">放大</span>
    </a-button>
    <a-button class="control-button" @click="handleZoomOut">
      <img class="control-button-icon" src="../assets/zoom-out.svg" />
      <span class="control-button-text">缩小</span>
    </a-button>
    <a-button class="control-button" @click="handleZoomReset">
      <img class="control-button-icon" src="../assets/rotate-ccw.svg" />
      <span class="control-button-text">重置</span>
    </a-button>
    <a-button class="control-button" @click="handleFoldAll">
      <img class="control-button-icon" src="../assets/minimize.svg" />
      <span class="control-button-text">折叠</span>
    </a-button>
    <a-button class="control-button" @click="handleUnfoldAll">
      <img class="control-button-icon" src="../assets/maximize.svg" />
      <span class="control-button-text">展开</span>
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import xml2js from 'xml2js';
import { xmlData2ProfileData, profileData2XmlData, adaptorIn, adaptorOut } from '../utils/adaptor';
import LogicFlow from '@logicflow/core';
import { NodeType } from '../common';

const props = defineProps({
  lf: LogicFlow,
});

function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xml';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const xml = e.target?.result as string;
      const parser = new xml2js.Parser();
      parser.parseString(xml, (err, result) => {
        if (err) {
          Message.error('配置文件解析失败');
          return;
        } else {
          props.lf?.render(adaptorIn(xmlData2ProfileData(result)));
          props.lf?.emit('custom:layout', {});
        }
      });
    };
    reader.readAsText(file);
  };
  input.click();
}

function handleExport() {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(profileData2XmlData((adaptorOut(props.lf!.getGraphRawData()))));
  const blob = new Blob([xml], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'profile.xml';
  a.click();
  URL.revokeObjectURL(url);
}

function handleZoomIn() {
  props.lf?.zoom(true);
}

function handleZoomOut() {
  props.lf?.zoom(false);
}

function handleZoomReset() {
  props.lf?.resetZoom();
  props.lf?.resetTranslate();
}

function handleFoldAll() {
  const graphModel = props.lf!.graphModel;
  const { nodes, edges } = graphModel;
  let startNode = nodes[0];
  nodes.forEach(node => {
    if (node.properties!.type === NodeType.Config || node.properties!.type === NodeType.Model) {
      node.setProperty('isFloded', true);
    }
    if (node.properties!.type !== NodeType.Instrument && node.properties!.type !== NodeType.Model) {
      node.visible = false;
    }
    if (node.properties!.type === NodeType.Instrument) {
      startNode = node;
    }
  });
  edges.forEach(edge => {
    if (edge.sourceNodeId !== startNode.id) {
      edge.visible = false;
    }
  });
  props.lf?.clearSelectElements();
  props.lf?.emit('blank:click', { e: new MouseEvent('click') });
  props.lf!.emit('custom:layout', {});
}

function handleUnfoldAll() {
  const graphModel = props.lf!.graphModel;
  const { nodes, edges } = graphModel;
  nodes.forEach(node => {
    if (node.properties!.type === NodeType.Config || node.properties!.type === NodeType.Model) {
      node.setProperty('isFloded', false);
    }
    node.visible = true;
  });
  edges.forEach(edge => {
    edge.visible = true;
  });
  props.lf!.emit('custom:layout', {});
}
</script>

<style scoped lang="scss">
.control-button-container {
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
.control-button {
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;

  .control-button-icon {
    width: 20px;
    height: 20px;
  }

  .control-button-text {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
  }
}
</style>
