/**
 * Hook para manejar las métricas del módulo BPM
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useBPMMetrics = (filters = {}) => {
  const [metrics, setMetrics] = useState({
    procesos: {
      total: 0,
      activos: 0,
      publicados: 0,
      borradores: 0
    },
    instancias: {
      total: 0,
      activas: 0,
      completadas: 0,
      canceladas: 0
    },
    tareas: {
      total: 0,
      pendientes: 0,
      enProgreso: 0,
      vencidas: 0
    },
    sla: {
      cumplimiento: 0,
      aTiempo: 0,
      enRiesgo: 0,
      vencidas: 0
    },
    tiempos: {
      promedioInstancia: 0,
      promedioTarea: 0,
      mayorDuracion: 0,
      menorDuracion: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getDashboardMetrics(filters);
      setMetrics(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar métricas:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const getProcessMetrics = async (processId, processFilters = {}) => {
    try {
      const data = await bpmService.getProcessMetrics(processId, processFilters);
      return data.data || data;
    } catch (err) {
      console.error('Error al cargar métricas del proceso:', err);
      throw err;
    }
  };

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
    getProcessMetrics
  };
};
