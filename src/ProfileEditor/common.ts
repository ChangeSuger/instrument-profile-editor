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

export const CONFIG_TYPE_OPTIONS = [
  { value: 'NI-VISA', label: 'NI-VISA' },
  { value: 'FUNCTION', label: 'FUNCTION' },
  { value: 'CUSTOM', label: 'CUSTOM' },
];

export const BOOLEAN_STRING_OPTIONS = [
  { value: 'true', label: '是' },
  { value: 'false', label: '否' },
];

export const COMMUNICATION_TYPE_OPTIONS = [
  { value: 'RS232', label: 'RS232' },
  { value: 'RS485', label: 'RS485' },
  { value: 'TCP', label: 'TCP' },
]

export const PARAMETER_TYPE_OPTIONS = [
  { value: 'System.Boolean', label: 'Boolean' },
  { value: 'System.Char', label: 'Char' },
  { value: 'System.Double', label: 'Double' },
  { value: 'System.Int32', label: 'Int32' },
  { value: 'System.String', label: 'String' },
  { value: 'System.Single', label: 'Single' },
];

export const STOP_BITS_OPTIONS = [
  { value: '0', label: 'None' },
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
  { value: '3', label: 'OnePointFive' },
];

export const PARITY_OPTIONS = [
  { value: '0', label: 'None' },
  { value: '1', label: 'Odd' },
  { value: '2', label: 'Even' },
  { value: '3', label: 'Mark' },
  { value: '4', label: 'Space' },
];

export const HAND_SHAKE_OPTIONS = [
  { value: '0', label: 'None' },
  { value: '1', label: 'Xon/Xoff' },
  { value: '2', label: 'RequestToSend' },
  { value: '3', label: 'RequestToSendXonXoff' },
];
