import type { InstrumentNodeData, ModelNodeData, ConfigNodeDataMap, OperationNodeDataMap } from "../types";

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

export function initConfigNodeData<T extends keyof ConfigNodeDataMap>(configType: T): ConfigNodeDataMap[T] {
  switch (configType) {
    case 'NI-VISA':
      return {
        id: 'NI-VISA',
      } as ConfigNodeDataMap[T];
    case 'FUNCTION':
      return {
        id: 'FUNCTION',
        spaceName: '',
        className: '',
        dllTemplate: '',
        isVisa: 'false',
      } as ConfigNodeDataMap[T];
    case 'CUSTOM':
      return {
        id: 'CUSTOM',
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
      } as ConfigNodeDataMap[T];
    default:
      return {
        id: 'NI-VISA',
      } as ConfigNodeDataMap[T];
  }
}

export function initOperationNodeData<T extends keyof OperationNodeDataMap>(operationType: T): OperationNodeDataMap[T] {
  switch (operationType) {
    case 'NI-VISA':
      return {
        id: '',
        parameter: '',
        hasReturn: 'false',
        command: '',
      } as OperationNodeDataMap['NI-VISA'] as OperationNodeDataMap[T];
    case 'FUNCTION':
      return {
        id: '',
        parameter: '',
        hasReturn: 'false',
        methods: [],
      } as OperationNodeDataMap['FUNCTION'] as OperationNodeDataMap[T];
    case 'CUSTOM':
      return {
        id: '',
        measureModes: [],
      } as OperationNodeDataMap['CUSTOM'] as OperationNodeDataMap[T];
    default:
      return {
        id: '',
        parameter: '',
        hasReturn: 'false',
        command: '',
      } as OperationNodeDataMap['NI-VISA'] as OperationNodeDataMap[T];
  }
}