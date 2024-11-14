import { HtmlNode, HtmlNodeModel, type IHtmlNodeProps, type Model } from '@logicflow/core';
import ModelNode from './ModelNode.vue';
import { createApp, h, ref } from 'vue';
import { NODE_WIDTH, NODE_HEIGHT } from '../common';

class ModelNodeView extends HtmlNode {
  root: HTMLDivElement;
  vueComponent: typeof ModelNode;
  vm: ReturnType<typeof createApp> | null = null;
  vmProps: ReturnType<typeof ref<{
    properties: object;
    isSelected: boolean;
    isHovered: boolean;
    isFloded: boolean;
    model: HtmlNodeModel;
  }>> | null = null;

  constructor(props: IHtmlNodeProps) {
    super(props)
    this.root = document.createElement('div');
    this.root.style.width = '100%';
    this.root.style.height = '100%';
    this.vueComponent = ModelNode;
  }

  shouldUpdate() {
    const data = {
      id: this.props.model.properties.id,
      isFloded: this.props.model.properties.isFloded,
      isSelected: this.props.model.isSelected,
      isHovered: this.props.model.isHovered
    }
    if (this.preProperties && this.preProperties === JSON.stringify(data)) {
      return false;
    }
    this.preProperties = JSON.stringify(data)
    return true
  }

  setHtml(rootEl: SVGForeignObjectElement): void {
    rootEl.appendChild(this.root);
    if (this.vm && this.vmProps) {
      this.vmProps.value = {
        properties: this.props.model.properties,
        isSelected: this.props.model.isSelected,
        isHovered: this.props.model.isHovered,
        isFloded: this.props.model.properties.isFloded as boolean,
        model: this.props.model
      }
    } else {
      // @ts-expect-error 暂时不解决
      this.vmProps = ref({
        properties: this.props.model.properties,
        isSelected: this.props.model.isSelected,
        isHovered: this.props.model.isHovered,
        isFloded: this.props.model.properties.isFloded,
        model: this.props.model,
      });
      this.vm = createApp({
        render: () => h(this.vueComponent, this.vmProps!.value)
      });
      this.vm.mount(this.root);
    }
  }
}

class ModelNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.width = NODE_WIDTH;
    this.height = NODE_HEIGHT;
  }

  getDefaultAnchor(): Model.AnchorConfig[] {
    const { width, x, y, id } = this;
    return [
      {
        x: x - width / 2,
        y,
        name: 'left',
        id: `${id}_0`
      },
      {
        x: x + width / 2,
        y,
        name: 'right',
        id: `${id}_1`,
      },
    ]
  }
}

export default {
  type: 'model-node',
  model: ModelNodeModel,
  view: ModelNodeView
}