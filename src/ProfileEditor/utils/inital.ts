import type { InstrumentNodeData, ModelNodeData, ConfigNodeData, OperationNodeData } from "../types";

export function initInstrumentNodeData(): InstrumentNodeData {
  return {
    id: '',
  };
}

export function initModelNodeData(): ModelNodeData {
  return {
    id: '',
    configType: 'NI-VISA',
  }
}

export function initConfigNodeData(): ConfigNodeData {
  return {
    id: 'NI-VISA',
    spaceName: '',
    className: '',
    dllTemplate: '',
    isVisa: 'false',
    communicationType: 'RS232',
    communicationConfig: {
      baudRate: '9600',
      dataBits: '8',
      stopBits: '1',
      parity: '0',
      bufferBytes: '0',
      handShake: '0',
      timeout: '2000',
      ip: '',
      port: '',
    },
  }
}

export function initOperationNodeData(): OperationNodeData {
  return {
    id: '',
    parameter: '',
    hasReturn: 'false',
    command: '',
    methods: [],
    measureModes: [],
  }
}