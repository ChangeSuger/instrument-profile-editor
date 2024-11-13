export enum NodeType {
  Instrument = 'Instrument',
  Model = 'Model',
  Config = 'Config',
  NI_VISA_OPERATION = 'NI-VISA_OPERATION',
  FUNCTION_OPERATION = 'FUNCTION_OPERATION',
  CUSTOM_OPERATION = 'CUSTOM_OPERATION',
}

export const OPERATION_NODE_TYPE_MAP = {
  'NI-VISA': NodeType.NI_VISA_OPERATION,
  'FUNCTION': NodeType.FUNCTION_OPERATION,
  'CUSTOM': NodeType.CUSTOM_OPERATION,
} as const;

export const POSITION_X = {
  'instrument-node': 100,
  'model-node': 350,
  'config-node': 600,
  'operation-node': 850,
} as const;

export const NODE_WIDTH = 150;
export const NODE_HEIGHT = 30;
export const NODE_WIDTH_HALF = NODE_WIDTH / 2;
