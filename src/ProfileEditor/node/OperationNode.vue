<template>
  <div class="node-wrap" :class="{ hovered: isHovered, selected: isSelected }">
    <div class="node-title">
      <span class="node-icon">
        <img src="../assets/zap.svg" />
      </span>
      <TypographyParagraph :ellipsis="{ row: 1, showTooltip: true }" class="node-name">
        {{ properties.id || '操作' }}
      </TypographyParagraph>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypographyParagraph } from '@arco-design/web-vue';
import { GraphModel, BaseNodeModel } from '@logicflow/core';
// import { computed } from 'vue';

defineProps({
  properties: {
    type: Object,
    required: true,
  },
  graphModel: {
    type: GraphModel,
    required: true,
  },
  model: {
    type: BaseNodeModel,
    required: true,
  },
  isSelected: Boolean,
  isHovered: Boolean,
});

// const isActive = computed(() => props.isHovered || props.isSelected);
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
      background: rgb(90, 204, 109);

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
}
</style>
