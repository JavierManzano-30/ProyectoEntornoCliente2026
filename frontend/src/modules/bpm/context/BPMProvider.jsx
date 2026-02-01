/**
 * Provider para el contexto BPM
 */

import React, { useState, useMemo, useCallback } from 'react';
import { BPMContext } from './BPMContext';

export const BPMProvider = ({ children }) => {
  // Estado global del módulo
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Filtros globales
  const [processFilters, setProcessFilters] = useState({
    search: '',
    status: '',
    category: ''
  });

  const [instanceFilters, setInstanceFilters] = useState({
    search: '',
    status: '',
    process: '',
    assignee: '',
    dateRange: null
  });

  const [taskFilters, setTaskFilters] = useState({
    priority: '',
    status: '',
    process: '',
    dueDate: ''
  });

  // Funciones de utilidad
  const updateProcessFilter = useCallback((key, value) => {
    setProcessFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearProcessFilters = useCallback(() => {
    setProcessFilters({
      search: '',
      status: '',
      category: ''
    });
  }, []);

  const updateInstanceFilter = useCallback((key, value) => {
    setInstanceFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearInstanceFilters = useCallback(() => {
    setInstanceFilters({
      search: '',
      status: '',
      process: '',
      assignee: '',
      dateRange: null
    });
  }, []);

  const updateTaskFilter = useCallback((key, value) => {
    setTaskFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearTaskFilters = useCallback(() => {
    setTaskFilters({
      priority: '',
      status: '',
      process: '',
      dueDate: ''
    });
  }, []);

  const contextValue = useMemo(() => ({
    // Estado
    selectedProcess,
    selectedInstance,
    selectedTask,
    processFilters,
    instanceFilters,
    taskFilters,
    
    // Setters
    setSelectedProcess,
    setSelectedInstance,
    setSelectedTask,
    
    // Funciones de filtros
    updateProcessFilter,
    clearProcessFilters,
    updateInstanceFilter,
    clearInstanceFilters,
    updateTaskFilter,
    clearTaskFilters
  }), [
    selectedProcess,
    selectedInstance,
    selectedTask,
    processFilters,
    instanceFilters,
    taskFilters,
    updateProcessFilter,
    clearProcessFilters,
    updateInstanceFilter,
    clearInstanceFilters,
    updateTaskFilter,
    clearTaskFilters
  ]);

  return (
    <BPMContext.Provider value={contextValue}>
      {children}
    </BPMContext.Provider>
  );
};
