<template>
  <LF ref="LFRef" />
  <a-space class="example-button">
    <a-button @click="loadExample" type="primary">
      导入示例数据
    </a-button>
    <a-button @click="check" type="primary" status="warning">
      校验
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
import LF from '@/ProfileEditor/ProfileEditor.vue';
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';

const LFRef = ref<InstanceType<typeof LF>>();

async function loadExample() {
  const res = (await fetch('/profile.xml', { method: 'GET' }));
  LFRef.value?.dataImport(await res.text());
}

function check() {
  if (!LFRef.value?.check()) {
    Message.success('校验通过');
  }
}
</script>

<style scoped>
.example-button {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
