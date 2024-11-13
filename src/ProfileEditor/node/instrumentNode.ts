import { HtmlNode, HtmlNodeModel, type IHtmlNodeProps, type Model } from '@logicflow/core';
import InstrumentNode from './InstrumentNode.vue';
import { createApp, h, ref } from 'vue';

class InstrumentNodeView extends HtmlNode {
  root: HTMLDivElement;
  vueComponent: typeof InstrumentNode;
  vm: ReturnType<typeof createApp> | null = null;
  vmProps: ReturnType<typeof ref<{
    properties: object;
    isSelected: boolean;
    isHovered: boolean;
    model: HtmlNodeModel;
  }>> | null = null;

  constructor(props: IHtmlNodeProps) {
    super(props)
    this.root = document.createElement('div');
    this.root.style.width = '100%';
    this.root.style.height = '100%';
    this.vueComponent = InstrumentNode;
  }

  shouldUpdate() {
    const data = {
      ...this.props.model.properties,
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
        model: this.props.model
      }
    } else {
      // @ts-expect-error 暂时不解决
      this.vmProps = ref({
        properties: this.props.model.properties,
        isSelected: this.props.model.isSelected,
        isHovered: this.props.model.isHovered,
        model: this.props.model,
      });
      this.vm = createApp({
        render: () => h(this.vueComponent, this.vmProps!.value)
      });
      this.vm.mount(this.root);
    }
  }
}

class InstrumentNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.width = 150;
    this.height = 30;
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
  type: 'instrument-node',
  model: InstrumentNodeModel,
  view: InstrumentNodeView
}