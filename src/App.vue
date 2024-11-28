<template>
  <LF ref="LFRef" />
  <a-space class="example-button">
    <a-button @click="loadExample" type="text">
      导入示例数据
    </a-button>
    <a-button @click="check" type="text" status="warning">
      校验
    </a-button>

    <a href="https://github.com/ChangeSuger/instrument-profile-editor" target="_blank">
      <a-button type="text">
        <template #icon>
          <IconGithub />
        </template>
      </a-button>
    </a>
  </a-space>
</template>

<script setup lang="ts">
import LF from '@/ProfileEditor/ProfileEditor.vue';
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconGithub } from '@arco-design/web-vue/es/icon';

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
