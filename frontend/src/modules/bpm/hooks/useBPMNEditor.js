/**
 * Hook para manejar el editor BPMN
 */

import { useState, useCallback } from 'react';
import { validateBPMNModel, serializeBPMNModel, parseProcessDefinition } from '../utils/bpmnParser';

export const useBPMNEditor = (initialModel = null) => {
  const [model, setModel] = useState(initialModel || { elements: [], connections: [] });
  const [selectedElement, setSelectedElement] = useState(null);
  const [validation, setValidation] = useState({ valid: true, errors: [], warnings: [] });
  const [isDirty, setIsDirty] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const updateModel = useCallback((newModel) => {
    setModel(newModel);
    setIsDirty(true);
    
    // Agregar al historial
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newModel);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
    
    // Validar automáticamente
    const validationResult = validateBPMNModel(newModel);
    setValidation(validationResult);
  }, [historyIndex]);

  const addElement = useCallback((element) => {
    const newModel = {
      ...model,
      elements: [...model.elements, element]
    };
    updateModel(newModel);
  }, [model, updateModel]);

  const updateElement = useCallback((elementId, updates) => {
    const newModel = {
      ...model,
      elements: model.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    };
    updateModel(newModel);
  }, [model, updateModel]);

  const removeElement = useCallback((elementId) => {
    const newModel = {
      ...model,
      elements: model.elements.filter(el => el.id !== elementId),
      connections: model.connections?.filter(
        conn => conn.source !== elementId && conn.target !== elementId
      ) || []
    };
    updateModel(newModel);
  }, [model, updateModel]);

  const addConnection = useCallback((connection) => {
    const newModel = {
      ...model,
      connections: [...(model.connections || []), connection]
    };
    updateModel(newModel);
  }, [model, updateModel]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setModel(history[historyIndex - 1]);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setModel(history[historyIndex + 1]);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const validateModel = useCallback(() => {
    const validationResult = validateBPMNModel(model);
    setValidation(validationResult);
    return validationResult;
  }, [model]);

  const exportModel = useCallback(() => {
    return serializeBPMNModel(model);
  }, [model]);

  const importModel = useCallback((definition) => {
    const parsedModel = parseProcessDefinition(definition);
    if (parsedModel) {
      setModel(parsedModel);
      setIsDirty(false);
      setHistory([parsedModel]);
      setHistoryIndex(0);
    }
  }, []);

  const resetModel = useCallback(() => {
    const emptyModel = { elements: [], connections: [] };
    setModel(emptyModel);
    setSelectedElement(null);
    setIsDirty(false);
    setHistory([emptyModel]);
    setHistoryIndex(0);
    setValidation({ valid: true, errors: [], warnings: [] });
  }, []);

  return {
    model,
    selectedElement,
    validation,
    isDirty,
    canUndo,
    canRedo,
    setSelectedElement,
    updateModel,
    addElement,
    updateElement,
    removeElement,
    addConnection,
    undo,
    redo,
    validateModel,
    exportModel,
    importModel,
    resetModel
  };
};
