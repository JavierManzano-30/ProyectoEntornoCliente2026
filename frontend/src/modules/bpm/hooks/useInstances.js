/**
 * Hook para manejar la lista de instancias
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useInstances = (initialFilters = {}) => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchInstances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getAllInstances(filters);
      setInstances(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar instancias:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  const startInstance = async (processId, instanceData) => {
    try {
      const newInstance = await bpmService.startInstance(processId, instanceData);
      setInstances(prev => [newInstance.data || newInstance, ...prev]);
      return newInstance.data || newInstance;
    } catch (err) {
      console.error('Error al iniciar instancia:', err);
      throw err;
    }
  };

  const cancelInstance = async (id, reason) => {
    try {
      await bpmService.cancelInstance(id, reason);
      setInstances(prev => prev.map(i => i.id === id ? { ...i, estado: 'cancelada' } : i));
    } catch (err) {
      console.error('Error al cancelar instancia:', err);
      throw err;
    }
  };

  const pauseInstance = async (id) => {
    try {
      await bpmService.pauseInstance(id);
      setInstances(prev => prev.map(i => i.id === id ? { ...i, estado: 'pausada' } : i));
    } catch (err) {
      console.error('Error al pausar instancia:', err);
      throw err;
    }
  };

  const resumeInstance = async (id) => {
    try {
      await bpmService.resumeInstance(id);
      setInstances(prev => prev.map(i => i.id === id ? { ...i, estado: 'activa' } : i));
    } catch (err) {
      console.error('Error al reanudar instancia:', err);
      throw err;
    }
  };

  return {
    instances,
    loading,
    error,
    filters,
    setFilters,
    fetchInstances,
    startInstance,
    cancelInstance,
    pauseInstance,
    resumeInstance
  };
};
