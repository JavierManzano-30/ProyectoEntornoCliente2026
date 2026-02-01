/**
 * Hook para manejar una instancia individual
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useInstance = (instanceId) => {
  const [instance, setInstance] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [variables, setVariables] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInstance = useCallback(async () => {
    if (!instanceId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getInstanceById(instanceId);
      setInstance(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar instancia:', err);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  const fetchTimeline = useCallback(async () => {
    if (!instanceId) return;
    
    try {
      const data = await bpmService.getInstanceTimeline(instanceId);
      setTimeline(data.data || data);
    } catch (err) {
      console.error('Error al cargar timeline:', err);
    }
  }, [instanceId]);

  const fetchVariables = useCallback(async () => {
    if (!instanceId) return;
    
    try {
      const data = await bpmService.getInstanceVariables(instanceId);
      setVariables(data.data || data);
    } catch (err) {
      console.error('Error al cargar variables:', err);
    }
  }, [instanceId]);

  useEffect(() => {
    fetchInstance();
    fetchTimeline();
    fetchVariables();
  }, [fetchInstance, fetchTimeline, fetchVariables]);

  const cancelInstance = async (reason) => {
    if (!instanceId) return;
    
    try {
      await bpmService.cancelInstance(instanceId, reason);
      setInstance(prev => ({ ...prev, estado: 'cancelada' }));
    } catch (err) {
      console.error('Error al cancelar instancia:', err);
      throw err;
    }
  };

  const pauseInstance = async () => {
    if (!instanceId) return;
    
    try {
      await bpmService.pauseInstance(instanceId);
      setInstance(prev => ({ ...prev, estado: 'pausada' }));
    } catch (err) {
      console.error('Error al pausar instancia:', err);
      throw err;
    }
  };

  const resumeInstance = async () => {
    if (!instanceId) return;
    
    try {
      await bpmService.resumeInstance(instanceId);
      setInstance(prev => ({ ...prev, estado: 'activa' }));
    } catch (err) {
      console.error('Error al reanudar instancia:', err);
      throw err;
    }
  };

  return {
    instance,
    timeline,
    variables,
    loading,
    error,
    fetchInstance,
    fetchTimeline,
    fetchVariables,
    cancelInstance,
    pauseInstance,
    resumeInstance
  };
};
