import type {
  ProfileData,
  ModelData,
  XMLProfileData,
  XMLModelData,
  XMLConfigDataMap,
  XMLCommunicationConfigDataMap,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import type LogicFlow from '@logicflow/core';
import { NodeType, NODE_WIDTH_HALF } from '../common';
import { initConfigNodeData, initOperationNodeData } from './inital';

/**
 * 将 xml2js 解析 xml 得到的数据适配为配置文件数据
 */
export function xmlData2ProfileData(xmlProfileData: XMLProfileData): ProfileData {
  const profileData: ProfileData = {
    id: xmlProfileData['设备类别'].$.id,
    models: [],
  };

  for (const xmlModelData of xmlProfileData['设备类别']['型号'] ?? []) {
    const modelData: ModelData = {
      id: xmlModelData.$.id,
      configType: xmlModelData['配置方式'][0],
    };
    for (const xmlConfigData of xmlModelData['配置'] ?? []) {
      if (xmlConfigData.$.id === 'NI-VISA') {
        const configData: ModelData['NI-VISA'] = {
          id: xmlConfigData.$.id,
          operations: (xmlConfigData as XMLConfigDataMap['NI-VISA'])['操作']?.map((xmlOperationData) => {
            return {
              id: xmlOperationData.$.id,
              parameter: xmlOperationData.$.Parameter,
              hasReturn: xmlOperationData.$.HasReturn,
              command: xmlOperationData['指令'][0],
            };
          }) || [],
        };
        if (!modelData['NI-VISA']) {
          modelData['NI-VISA'] = configData;
        }
      } else if (xmlConfigData.$.id === 'FUNCTION') {
        const [spaceName = '', nextString = ''] = (xmlConfigData as XMLConfigDataMap['FUNCTION'])['类'][0].$.Type.split('.');
        const [className = '', dllTemplate = ''] = nextString.split(', ');
        const configData: ModelData['FUNCTION'] = {
          id: xmlConfigData.$.id,
          spaceName,
          className,
          dllTemplate,
          isVisa: (xmlConfigData as XMLConfigDataMap['FUNCTION'])['类'][0].$.IsVISA,
          operations: (xmlConfigData as XMLConfigDataMap['FUNCTION'])['操作']?.map((xmlOperationData) => {
            return {
              id: xmlOperationData.$.id,
              parameter: xmlOperationData.$.Parameter,
              hasReturn: xmlOperationData.$.HasReturn,
              methods: xmlOperationData['方法']?.map(xmlMethodData => {
                return {
                  name: xmlMethodData.$.Name,
                  parameters: xmlMethodData['参数']?.map(xmlParameterData => {
                    return {
                      type: xmlParameterData.$.Type,
                      value: xmlParameterData.$.Value,
                    };
                  }) || [],
                };
              }) || [],
            };
          }) || [],
        };
        if (!modelData.FUNCTION) {
          modelData.FUNCTION = configData;
        }
      } else if (xmlConfigData.$.id === 'CUSTOM') {
        const communicationType = (xmlConfigData as XMLConfigDataMap['CUSTOM'])['通信方法'][0];
        if (communicationType === 'RS232' || communicationType === 'RS485') {
          // @ts-expect-error 这个类型定义太麻烦了
          const communicationConfig: XMLCommunicationConfigDataMap['RS232']['RS232'][0] = xmlConfigData[communicationType][0];
          const configData: ModelData['CUSTOM'] = {
            id: xmlConfigData.$.id,
            communicationType,
            communicationConfig: {
              baudRate: communicationConfig['波特率'][0],
              dataBits: communicationConfig['数据位'][0],
              stopBits: communicationConfig['停止位'][0],
              parity: communicationConfig['奇偶校验'][0],
              bufferBytes: communicationConfig['缓冲区字节数'][0],
              handShake: communicationConfig['握手协议'][0],
              timeout: communicationConfig['超时时间'][0],
              ip: '',
              port: '',
            },
            operations: (xmlConfigData as XMLConfigDataMap['CUSTOM'])['操作']?.map((xmlOperationData) => {
              return {
                id: xmlOperationData.$.id,
                measureModes: xmlOperationData['测量模式']?.map(xmlMeasureModeData => {
                  return {
                    id: xmlMeasureModeData.$.id,
                    workplaces: xmlMeasureModeData['工位']?.map(xmlWorkplaceData => {
                      return {
                        id: xmlWorkplaceData.$.id,
                        byteStreams: xmlWorkplaceData['字节流']?.map(xmlByteStreamData => {
                          return {
                            send: xmlByteStreamData.$.send,
                            receive: xmlByteStreamData.$.receive,
                          };
                        }) || [],
                      };
                    }) || [],
                  };
                }) || [],
              };
            }) || [],
          };
          if (!modelData.CUSTOM) {
            modelData.CUSTOM = configData;
          }
        } else if (communicationType === 'TCP') {
          // @ts-expect-error 这个类型定义太麻烦了
          const communicationConfig: XMLCommunicationConfigDataMap['TCP']['TCP'][0] = xmlConfigData[communicationType][0];
          const configData: ModelData['CUSTOM'] = {
            id: xmlConfigData.$.id,
            communicationType,
            communicationConfig: {
              baudRate: '',
              dataBits: '',
              stopBits: '',
              parity: '',
              bufferBytes: '',
              handShake: '',
              timeout: '',
              ip: communicationConfig['IP'][0],
              port: communicationConfig['端口'][0],
            },
            operations: (xmlConfigData as XMLConfigDataMap['CUSTOM'])['操作']?.map((xmlOperationData) => {
              return {
                id: xmlOperationData.$.id,
                measureModes: xmlOperationData['测量模式']?.map(xmlMeasureModeData => {
                  return {
                    id: xmlMeasureModeData.$.id,
                    workplaces: xmlMeasureModeData['工位']?.map(xmlWorkplaceData => {
                      return {
                        id: xmlWorkplaceData.$.id,
                        byteStreams: xmlWorkplaceData['字节流']?.map(xmlByteStreamData => {
                          return {
                            send: xmlByteStreamData.$.send,
                            receive: xmlByteStreamData.$.receive,
                          };
                        }) || [],
                      };
                    }) || [],
                  };
                }) || [],
              };
            }) || [],
          };
          if (!modelData.CUSTOM) {
            modelData.CUSTOM = configData;
          }
        }
      }
    }
    profileData.models.push(modelData);
  }

  return profileData;
}


/**
 * 将配置文件数据适配为 xml 数据，使得 xml2js 可以将其转换为 xml 文件
 */
export function profileData2XmlData(profileData: ProfileData): XMLProfileData {
  const xmlProfileData: XMLProfileData = {
    '设备类别' : {
      $: { id: profileData.id },
      '型号': [],
    }
  };

  for (const modelData of profileData.models ?? []) {
    const xmlModelData: XMLModelData = {
      $: { id: modelData.id },
      '配置方式': [modelData.configType],
      '配置': [],
    };
    if (modelData['NI-VISA']) {
      const xmlConfigData: XMLConfigDataMap['NI-VISA'] = {
        $: { id: 'NI-VISA' },
        '操作': modelData['NI-VISA'].operations?.map(operationData => {
          return {
            $: {
              id: operationData.id,
              Parameter: operationData.parameter,
              HasReturn: operationData.hasReturn,
            },
            '指令': [operationData.command],
          };
        }),
      };
      xmlModelData['配置'].push(xmlConfigData);
    }
    if (modelData.FUNCTION) {
      const xmlConfigData: XMLConfigDataMap['FUNCTION'] = {
        $: { id: 'FUNCTION' },
        '类': [{
          $: {
            Type: `${modelData.FUNCTION.spaceName}.${modelData.FUNCTION.className}, ${modelData.FUNCTION.dllTemplate}`,
            IsVISA: modelData.FUNCTION.isVisa,
          }
        }],
        '操作': modelData.FUNCTION.operations?.map(operationData => {
          return {
            $: {
              id: operationData.id,
              Parameter: operationData.parameter,
              HasReturn: operationData.hasReturn,
            },
            '方法': operationData.methods?.map(methodData => {
              return {
                $: { Name: methodData.name },
                '参数': methodData.parameters?.map(parameterData => {
                  return {
                    $: {
                      Type: parameterData.type,
                      Value: parameterData.value,
                    }
                  };
                }),
              };
            }),
          };
        }),
      };
      xmlModelData['配置'].push(xmlConfigData);
    }
    if (modelData.CUSTOM) {
      // @ts-expect-error 这个类型定义太麻烦了
      const xmlConfigData: XMLConfigDataMap['CUSTOM'] = {
        $: { id: 'CUSTOM' },
        '通信方法': [modelData.CUSTOM.communicationType],
        [modelData.CUSTOM.communicationType]: [{
          ...(
            modelData.CUSTOM.communicationType === 'RS232' || modelData.CUSTOM.communicationType === 'RS485'
            ? {
              '波特率': [modelData.CUSTOM.communicationConfig.baudRate],
              '数据位': [modelData.CUSTOM.communicationConfig.dataBits],
              '停止位': [modelData.CUSTOM.communicationConfig.stopBits],
              '奇偶校验': [modelData.CUSTOM.communicationConfig.parity],
              '缓冲区字节数': [modelData.CUSTOM.communicationConfig.bufferBytes],
              '握手协议': [modelData.CUSTOM.communicationConfig.handShake],
              '超时时间': [modelData.CUSTOM.communicationConfig.timeout],
            }
            : {
              'IP': [modelData.CUSTOM.communicationConfig.ip],
              '端口': [modelData.CUSTOM.communicationConfig.port],
            }
          ),
        }],
        '操作': modelData.CUSTOM.operations?.map(operationData => {
          return {
            $: { id: operationData.id },
            '测量模式': operationData.measureModes?.map(measureModeData => {
              return {
                $: { id: measureModeData.id },
                '工位': measureModeData.workplaces?.map(workplaceData => {
                  return {
                    $: { id: workplaceData.id },
                    '字节流': workplaceData.byteStreams?.map(byteStreamData => {
                      return {
                        $: {
                          send: byteStreamData.send,
                          receive: byteStreamData.receive,
                        }
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
      xmlModelData['配置'].push(xmlConfigData);
    }
    xmlProfileData['设备类别']['型号'].push(xmlModelData);
  }

  return xmlProfileData;
}

/**
 * 将配置文件数据适配为流程图数据
 */
export function adaptorIn(profileData: ProfileData): LogicFlow.GraphData {
  const graphData: LogicFlow.GraphData = {
    nodes: [],
    edges: [],
  };

  const instrumentNode = {
    id: uuidv4(),
    type: 'instrument-node',
    x: 0,
    y: 0,
    properties: {
      type: NodeType.Instrument,
      id: profileData.id,
    }
  };

  graphData.nodes.push(instrumentNode);

  for (const modelData of profileData.models ?? []) {
    const modelNode = {
      id: uuidv4(),
      type: 'model-node',
      x: 0,
      y: 0,
      properties: {
        type: NodeType.Model,
        parentId: instrumentNode.id,
        id: modelData.id,
        configType: modelData.configType,
      }
    };

    graphData.nodes.push(modelNode);
    graphData.edges.push(initEdgeData(instrumentNode.id, modelNode.id));

    if (modelData['NI-VISA']) {
      const configNode = {
        id: uuidv4(),
        type: 'config-node',
        x: 0,
        y: 0,
        properties: {
          type: NodeType.Config,
          parentId: modelNode.id,
          ...initConfigNodeData(),
          id: modelData['NI-VISA'].id,
        }
      };

      graphData.nodes.push(configNode);
      graphData.edges.push(initEdgeData(modelNode.id, configNode.id));

      for (const operationData of modelData['NI-VISA'].operations ?? []) {
        const operationNode = {
          id: uuidv4(),
          type: 'operation-node',
          x: 0,
          y: 0,
          properties: {
            type: NodeType.NI_VISA_OPERATION,
            parentId: configNode.id,
            ...initOperationNodeData(),
            id: operationData.id,
            parameter: operationData.parameter,
            hasReturn: operationData.hasReturn,
            command: operationData.command,
          }
        };

        graphData.nodes.push(operationNode);
        graphData.edges.push(initEdgeData(configNode.id, operationNode.id));
      }
    }

    if (modelData['FUNCTION']) {
      const configNode = {
        id: uuidv4(),
        type: 'config-node',
        x: 0,
        y: 0,
        properties: {
          type: NodeType.Config,
          parentId: modelNode.id,
          ...initConfigNodeData(),
          id: modelData.FUNCTION.id,
          spaceName: modelData.FUNCTION.spaceName,
          className: modelData.FUNCTION.className,
          dllTemplate: modelData.FUNCTION.dllTemplate,
          isVisa: modelData.FUNCTION.isVisa,
        }
      };

      graphData.nodes.push(configNode);
      graphData.edges.push(initEdgeData(modelNode.id, configNode.id));

      for (const operationData of modelData.FUNCTION.operations ?? []) {
        const operationNode = {
          id: uuidv4(),
          type: 'operation-node',
          x: 0,
          y: 0,
          properties: {
            type: NodeType.FUNCTION_OPERATION,
            parentId: configNode.id,
            ...initOperationNodeData(),
            id: operationData.id,
            parameter: operationData.parameter,
            hasReturn: operationData.hasReturn,
            methods: operationData.methods,
          }
        };

        graphData.nodes.push(operationNode);
        graphData.edges.push(initEdgeData(configNode.id, operationNode.id));
      }
    }

    if (modelData['CUSTOM']) {
      const configNode = {
        id: uuidv4(),
        type: 'config-node',
        x: 0,
        y: 0,
        properties: {
          type: NodeType.Config,
          parentId: modelNode.id,
          ...initConfigNodeData(),
          id: modelData.CUSTOM.id,
          communicationType: modelData.CUSTOM.communicationType,
          communicationConfig: modelData.CUSTOM.communicationConfig,
        }
      };

      graphData.nodes.push(configNode);
      graphData.edges.push(initEdgeData(modelNode.id, configNode.id));

      for (const operationData of modelData.CUSTOM.operations ?? []) {
        const operationNode = {
          id: uuidv4(),
          type: 'operation-node',
          x: 0,
          y: 0,
          properties: {
            type: NodeType.CUSTOM_OPERATION,
            parentId: configNode.id,
            ...initOperationNodeData(),
            id: operationData.id,
            measureModes: operationData.measureModes,
          }
        };

        graphData.nodes.push(operationNode);
        graphData.edges.push(initEdgeData(configNode.id, operationNode.id));
      }
    }
  }

  return graphData;
}

function initEdgeData(sourceNodeId: string, targetNodeId: string): LogicFlow.EdgeData {
  return {
    id: uuidv4(),
    type: 'polyline',
    sourceNodeId,
    targetNodeId,
    startPoint: { x: NODE_WIDTH_HALF, y: 0 },
    endPoint: { x: -NODE_WIDTH_HALF, y: 0 },
  };
}

/**
 * 将流程图数据适配为配置文件数据
 */
export function adaptorOut(graphData: LogicFlow.GraphData): ProfileData {
  const nodeMap = new Map<string, LogicFlow.NodeData[]>();
  let startNode = graphData.nodes[0];
  graphData.nodes.forEach((node) => {
    const parentId = node.properties!.parentId;
    if (parentId) {
      if (nodeMap.has(parentId)) {
        nodeMap.get(parentId)!.push(node);
      } else {
        nodeMap.set(parentId, [node]);
      }
    }
    if (node.type === 'instrument-node') {
      startNode = node;
    }
  });

  const profileData: ProfileData = {
    id: startNode.properties!.id,
    models: [],
  };

  nodeMap.get(startNode.id)?.forEach(modelNode => {
    const modelData: ModelData = {
      id: modelNode.properties!.id,
      configType: modelNode.properties!.configType,
    };

    nodeMap.get(modelNode.id)?.forEach(configNode => {
      if (configNode.properties!.id === 'NI-VISA' && !modelData['NI-VISA']) {
        const configData: ModelData['NI-VISA'] = {
          id: 'NI-VISA',
          operations: [],
        };

        nodeMap.get(configNode.id)?.forEach(operationNode => {
          configData.operations.push({
            id: operationNode.properties!.id,
            parameter: operationNode.properties!.parameter,
            hasReturn: operationNode.properties!.hasReturn,
            command: operationNode.properties!.command,
          });
        });

        modelData['NI-VISA'] = configData;
      } else if (configNode.properties!.id === 'FUNCTION' && !modelData.FUNCTION) {
        const configData: ModelData['FUNCTION'] = {
          id: 'FUNCTION',
          spaceName: configNode.properties!.spaceName,
          className: configNode.properties!.className,
          dllTemplate: configNode.properties!.dllTemplate,
          isVisa: configNode.properties!.isVisa,
          operations: [],
        };

        nodeMap.get(configNode.id)?.forEach(operationNode => {
          configData.operations.push({
            id: operationNode.properties!.id,
            parameter: operationNode.properties!.parameter,
            hasReturn: operationNode.properties!.hasReturn,
            methods: operationNode.properties!.methods,
          });
        });

        modelData.FUNCTION = configData;
      } else if (configNode.properties!.id === 'CUSTOM' && !modelData.CUSTOM) {
        const configData: ModelData['CUSTOM'] = {
          id: 'CUSTOM',
          communicationType: configNode.properties!.communicationType,
          communicationConfig: configNode.properties!.communicationConfig,
          operations: [],
        };

        nodeMap.get(configNode.id)?.forEach(operationNode => {
          const operationData = {
            id: operationNode.properties!.id,
            measureModes: operationNode.properties!.measureModes,
          };
          configData.operations.push(operationData);
        });

        modelData.CUSTOM = configData;
      }
    });

    profileData.models.push(modelData);
  });

  return profileData;
}
