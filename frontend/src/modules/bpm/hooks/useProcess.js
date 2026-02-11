/**
 * Hook para manejar un proceso individual
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useProcess = (processId) => {
  const [process, setProcess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProcess = useCallback(async () => {
    if (!processId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getProcessById(processId);
      setProcess(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar proceso:', err);
    } finally {
      setLoading(false);
    }
  }, [processId]);

  useEffect(() => {
    fetchProcess();
  }, [fetchProcess]);

  const updateProcess = async (processData) => {
    if (!processId) return;
    
    try {
      const updated = await bpmService.updateProcess(processId, processData);
      setProcess(updated.data || updated);
      return updated.data || updated;
    } catch (err) {
      console.error('Error al actualizar proceso:', err);
      throw err;
    }
  };

  const publishProcess = async () => {
    if (!processId) return;
    
    try {
      const published = await bpmService.publishProcess(processId);
      setProcess(published.data || published);
      return published.data || published;
    } catch (err) {
      console.error('Error al publicar proceso:', err);
      throw err;
    }
  };

  const validateProcess = async (processData) => {
    try {
      const validation = await bpmService.validateProcess(processData);
      return validation.data || validation;
    } catch (err) {
      console.error('Error al validar proceso:', err);
      throw err;
    }
  };

  return {
    process,
    loading,
    error,
    fetchProcess,
    updateProcess,
    publishProcess,
    validateProcess
  };
};
