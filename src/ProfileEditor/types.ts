// 用于数据转换的配置文件定义
export type ProfileData = InstrumentNodeData & {
  models: ModelData[];
}

export type ModelData = ModelNodeData & {
  'NI-VISA'?: ConfigNodeDataMap['NI-VISA'] & { operations: OperationNodeDataMap['NI-VISA'][] };
  'FUNCTION'?: ConfigNodeDataMap['FUNCTION'] & { operations: OperationNodeDataMap['FUNCTION'][] };
  'CUSTOM'?: ConfigNodeDataMap['CUSTOM'] & { operations: OperationNodeDataMap['CUSTOM'][] };
};

// 流程图节点数据梳理

export type ConfigType = 'NI-VISA' | 'FUNCTION' | 'CUSTOM';
export type CommunicationType = 'RS232' | 'RS485' | 'TCP';

export type InstrumentNodeData = {
  /**
   * 设备类别
   */
  id: string;
}

export type ModelNodeData = {
  /**
   * 设备型号
   */
  id: string;
  /**
   * 配置方式
   */
  configType: ConfigType;
}

export type ConfigNodeData =
  Omit<ConfigNodeDataMap['NI-VISA'], 'id'> &
  Omit<ConfigNodeDataMap['FUNCTION'], 'id'> &
  Omit<ConfigNodeDataMap['CUSTOM'], 'id'> & {
    id: ConfigType;
  };

export type ConfigNodeDataMap = {
  'NI-VISA': {
    id: 'NI-VISA';
  };
  'FUNCTION': {
    id: 'FUNCTION';
    spaceName: string;
    className: string;
    dllTemplate: string;
    isVisa: BooleanString;
  }
  'CUSTOM': {
    id: 'CUSTOM';
  } & {
    communicationType: 'RS232' | 'RS485' | 'TCP';
    communicationConfig: {
      /**
       * 波特率
       */
      baudRate: string;
      /**
       * 数据位
       */
      dataBits: string;
      /**
       * 停止位
       * - `0`: None
       * - `1`: One
       * - `2`: Two
       * - `3`: OnePointFive
       */
      stopBits: string;
      /**
       * 奇偶校验
       * - `0`: None
       * - `1`: Odd
       * - `2`: Even
       * - `3`: Mark
       * - `4`: Space
       */
      parity: string;
      /**
       * 缓冲区字节数
       */
      bufferBytes: string;
      /**
       * 握手协议
       * - `0`: None
       * - `1`: Xon/Xoff
       * - `2`: RequestToSend
       * - `3`: RequestToSendXonXoff
       */
      handShake: string;
      /**
       * 超时时间
       */
      timeout: string;
      /**
       * IP 地址
       */
      ip: string;
      /**
       * 端口号
       */
      port: string;
    }
  }
}

export type OperationNodeData = OperationNodeDataMap['NI-VISA'] & OperationNodeDataMap['FUNCTION'] & OperationNodeDataMap['CUSTOM'];

export type OperationNodeDataMap = {
  'NI-VISA': {
    id: string;
    parameter: string;
    hasReturn: BooleanString;
    command: string;
  }
  'FUNCTION': {
    id: string;
    parameter: string;
    hasReturn: BooleanString;
    methods: MethodData[];
  }
  'CUSTOM': {
    id: string;
    measureModes: MeasureMode[];
  }
}

export type MethodData = {
  name: string;
  parameters: {
    type: string;
    value: string;
  }[];
}

export type MeasureMode = {
  id: string;
  workplaces: Workplace[];
}

export type Workplace = {
  id: string;
  byteStreams: ByteStream[];
}

export type ByteStream = {
  send: string;
  receive: string;
}

// xml2js 解析 xml 得到的配置文件数据定义

export type XMLProfileData = {
  '设备类别': {
    $: { id: string };
    '型号': XMLModelData[];
  }
}

export type XMLModelData = {
  $: { id: string };
  '配置方式': [ConfigType];
  '配置': XMLConfigData[];
}

export type XMLConfigData = XMLConfigDataMap[keyof XMLConfigDataMap];

export type XMLConfigDataMap = {
  'NI-VISA': {
    $: { id: 'NI-VISA' };
    '操作': XMLOperationDataMap['NI-VISA'][];
  }
  'FUNCTION': {
    $: { id: 'FUNCTION' };
    '操作': XMLOperationDataMap['FUNCTION'][];
    '类': [{ $: {
      Type: string;
      IsVISA: BooleanString;
    }}]
  }
  'CUSTOM': {
    $: { id: 'CUSTOM' };
    '操作': XMLOperationDataMap['CUSTOM'][];
  } & (XMLCommunicationConfigDataMap[keyof XMLCommunicationConfigDataMap])
}

export type XMLCommunicationConfigDataMap = {
  'RS232': {
    '通信方法': ['RS232'];
    RS232: [{
      '波特率': [string];
      '数据位': [string];
      '停止位': [string];
      '奇偶校验': [string];
      '缓冲区字节数': [string];
      '握手协议': [string];
      '超时时间': [string];
    }]
  }
  'RS485': {
    '通信方法': ['RS485'];
    RS485: [{
      '波特率': [string];
      '数据位': [string];
      '停止位': [string];
      '奇偶校验': [string];
      '缓冲区字节数': [string];
      '握手协议': [string];
      '超时时间': [string];
    }]
  }
  'TCP': {
    '通信方法': ['TCP'];
    TCP: [{
      IP: [string];
      '端口': [string];
    }]
  }
}

export type XMLOperationDataMap = {
  'NI-VISA': {
    $: { id: string; Parameter: string; HasReturn: BooleanString };
    '指令': [string];
  }
  'FUNCTION': {
    $: { id: string; Parameter: string; HasReturn: BooleanString };
    '方法': XMLMethodData[];
  }
  'CUSTOM': {
    $: { id: string };
    '测量模式': XMLMeasureModeData[];
  }
}

export type XMLMethodData = {
  $: { Name: string };
  '参数': XMLParameterData[];
}

export type XMLParameterData = {
  $: { Type: string; Value: string };
}

export type XMLMeasureModeData = {
  $: { id: string };
  '工位': XMLWorkplaceData[];
}

export type XMLWorkplaceData = {
  $: { id: string };
  '字节流': XMLByteStreamData[];
}

export type XMLByteStreamData = {
  $: { send: string; receive: string };
}

export type BooleanString = 'true' | 'false';
