/**
 * Utilidades para parsear y validar modelos BPMN
 */

import { BPMN_ELEMENT_TYPES } from '../constants/bpmnElements';

/**
 * Validar modelo BPMN básico
 */
export const validateBPMNModel = (model) => {
  const errors = [];
  
  if (!model || !model.elements) {
    errors.push('El modelo no contiene elementos');
    return { valid: false, errors };
  }
  
  const elements = model.elements;
  
  // Validar que exista al menos un evento de inicio
  const startEvents = elements.filter(e => e.type === BPMN_ELEMENT_TYPES.START_EVENT);
  if (startEvents.length === 0) {
    errors.push('El proceso debe tener al menos un evento de inicio');
  }
  
  // Validar que exista al menos un evento de fin
  const endEvents = elements.filter(e => e.type === BPMN_ELEMENT_TYPES.END_EVENT);
  if (endEvents.length === 0) {
    errors.push('El proceso debe tener al menos un evento de fin');
  }
  
  // Validar que todos los elementos tengan ID
  const elementsWithoutId = elements.filter(e => !e.id);
  if (elementsWithoutId.length > 0) {
    errors.push(`${elementsWithoutId.length} elementos sin identificador`);
  }
  
  // Validar conexiones
  const flows = elements.filter(e => e.type === BPMN_ELEMENT_TYPES.SEQUENCE_FLOW);
  flows.forEach(flow => {
    if (!flow.source || !flow.target) {
      errors.push(`Flujo ${flow.id} incompleto: falta origen o destino`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
};

/**
 * Parsear definición de proceso
 */
export const parseProcessDefinition = (definition) => {
  try {
    if (typeof definition === 'string') {
      return JSON.parse(definition);
    }
    return definition;
  } catch (error) {
    console.error('Error parseando definición de proceso:', error);
    return null;
  }
};

/**
 * Serializar modelo BPMN
 */
export const serializeBPMNModel = (model) => {
  try {
    return JSON.stringify(model, null, 2);
  } catch (error) {
    console.error('Error serializando modelo:', error);
    return null;
  }
};

/**
 * Extraer tareas de usuario del modelo
 */
export const extractUserTasks = (model) => {
  if (!model || !model.elements) return [];
  
  return model.elements.filter(e => e.type === BPMN_ELEMENT_TYPES.USER_TASK);
};

/**
 * Extraer gateways del modelo
 */
export const extractGateways = (model) => {
  if (!model || !model.elements) return [];
  
  return model.elements.filter(e => 
    e.type === BPMN_ELEMENT_TYPES.EXCLUSIVE_GATEWAY ||
    e.type === BPMN_ELEMENT_TYPES.PARALLEL_GATEWAY ||
    e.type === BPMN_ELEMENT_TYPES.INCLUSIVE_GATEWAY
  );
};

/**
 * Calcular complejidad del proceso
 */
export const calculateProcessComplexity = (model) => {
  if (!model || !model.elements) return 0;
  
  const userTasks = extractUserTasks(model).length;
  const gateways = extractGateways(model).length;
  const serviceTasks = model.elements.filter(e => e.type === BPMN_ELEMENT_TYPES.SERVICE_TASK).length;
  
  // Fórmula simple de complejidad
  return userTasks + (gateways * 2) + serviceTasks;
};

/**
 * Obtener ruta crítica del proceso
 */
export const getCriticalPath = (model) => {
  // Implementación simplificada
  // En un caso real, se calcularía el camino más largo considerando todas las ramas
  if (!model || !model.elements) return [];
  
  const activities = model.elements.filter(e => 
    e.type === BPMN_ELEMENT_TYPES.USER_TASK ||
    e.type === BPMN_ELEMENT_TYPES.SERVICE_TASK
  );
  
  return activities;
};

/**
 * Generar thumbnail del modelo
 */
export const generateModelThumbnail = (model) => {
  // En un caso real, esto generaría una imagen miniatura del diagrama
  // Por ahora retornamos un resumen textual
  if (!model || !model.elements) return null;
  
  return {
    elementCount: model.elements.length,
    taskCount: model.elements.filter(e => 
      e.type === BPMN_ELEMENT_TYPES.TASK ||
      e.type === BPMN_ELEMENT_TYPES.USER_TASK
    ).length,
    gatewayCount: extractGateways(model).length
  };
};
