/**
 * Hook para manejar la lista de procesos BPM
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useProcesses = (initialFilters = {}) => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchProcesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getAllProcesses(filters);
      setProcesses(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar procesos:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  const createProcess = async (processData) => {
    try {
      const newProcess = await bpmService.createProcess(processData);
      setProcesses(prev => [...prev, newProcess.data || newProcess]);
      return newProcess.data || newProcess;
    } catch (err) {
      console.error('Error al crear proceso:', err);
      throw err;
    }
  };

  const updateProcess = async (id, processData) => {
    try {
      const updated = await bpmService.updateProcess(id, processData);
      setProcesses(prev => prev.map(p => p.id === id ? (updated.data || updated) : p));
      return updated.data || updated;
    } catch (err) {
      console.error('Error al actualizar proceso:', err);
      throw err;
    }
  };

  const publishProcess = async (id) => {
    try {
      const published = await bpmService.publishProcess(id);
      setProcesses(prev => prev.map(p => p.id === id ? (published.data || published) : p));
      return published.data || published;
    } catch (err) {
      console.error('Error al publicar proceso:', err);
      throw err;
    }
  };

  const deleteProcess = async (id) => {
    try {
      await bpmService.deleteProcess(id);
      setProcesses(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error al eliminar proceso:', err);
      throw err;
    }
  };

  return {
    processes,
    loading,
    error,
    filters,
    setFilters,
    fetchProcesses,
    createProcess,
    updateProcess,
    publishProcess,
    deleteProcess
  };
};
