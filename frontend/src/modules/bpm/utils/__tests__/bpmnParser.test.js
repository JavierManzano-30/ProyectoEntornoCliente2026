import { describe, it, expect } from 'vitest';
import {
  validateBPMNModel,
  calculateProcessComplexity
} from '../bpmnParser';
import { BPMN_ELEMENT_TYPES } from '../../constants/bpmnElements';

describe('bpmnParser', () => {
  it('marca inválido un modelo sin elementos', () => {
    const result = validateBPMNModel({ elements: [] });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('valida presencia de eventos de inicio y fin', () => {
    const model = {
      elements: [
        { id: 'start', type: BPMN_ELEMENT_TYPES.START_EVENT },
        { id: 'end', type: BPMN_ELEMENT_TYPES.END_EVENT }
      ]
    };
    const result = validateBPMNModel(model);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('calcula complejidad del proceso', () => {
    const model = {
      elements: [
        { id: 'start', type: BPMN_ELEMENT_TYPES.START_EVENT },
        { id: 'task-1', type: BPMN_ELEMENT_TYPES.USER_TASK },
        { id: 'gateway-1', type: BPMN_ELEMENT_TYPES.EXCLUSIVE_GATEWAY },
        { id: 'service-1', type: BPMN_ELEMENT_TYPES.SERVICE_TASK },
        { id: 'end', type: BPMN_ELEMENT_TYPES.END_EVENT }
      ]
    };

    const complexity = calculateProcessComplexity(model);
    expect(complexity).toBe(1 + 2 + 1);
  });
});
