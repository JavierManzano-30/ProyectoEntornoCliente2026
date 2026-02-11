/**
 * Hook para manejar la bandeja de tareas con polling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { bpmService } from '../services/bpmService';
import { useBPMRealtime } from './useBPMRealtime';
import { BPM_REALTIME_ENABLED } from '../config/realtime';

export const useTaskInbox = (initialFilters = {}, pollingInterval = 30000) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0
  });
  
  const intervalRef = useRef(null);

  const buildStats = useCallback((taskList) => ({
    total: taskList.length,
    pending: taskList.filter(t => t.estado === 'pending' || t.estado === 'assigned').length,
    inProgress: taskList.filter(t => t.estado === 'in_progress').length,
    overdue: taskList.filter(t => {
      if (!t.fecha_limite) return false;
      return new Date(t.fecha_limite) < new Date() && t.estado !== 'completed';
    }).length
  }), []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getTaskInbox(filters);
      const taskList = data.data || data;
      setTasks(taskList);
      setStats(buildStats(taskList));
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar bandeja:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, buildStats]);

  useEffect(() => {
    fetchTasks();
    
    // Configurar polling
    if (pollingInterval > 0) {
      intervalRef.current = setInterval(fetchTasks, pollingInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchTasks, pollingInterval]);

  useEffect(() => {
    setStats(buildStats(tasks));
  }, [tasks, buildStats]);

  useBPMRealtime({
    enabled: BPM_REALTIME_ENABLED,
    topics: ['tasks'],
    onMessage: (message) => {
      if (!message || typeof message !== 'object') return;
      const { type, payload } = message;
      if (!type) return;

      setTasks((prev) => {
        switch (type) {
          case 'task.created':
            return payload ? [payload, ...prev] : prev;
          case 'task.updated':
          case 'task.assigned':
            return payload ? prev.map(t => t.id === payload.id ? payload : t) : prev;
          case 'task.completed':
          case 'task.deleted':
            return payload ? prev.filter(t => t.id !== payload.id) : prev;
          default:
            return prev;
        }
      });
    }
  });

  const refreshTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completeTask = async (id, taskData) => {
    try {
      await bpmService.completeTask(id, taskData);
      setTasks(prev => prev.filter(t => t.id !== id));
      refreshTasks();
    } catch (err) {
      console.error('Error al completar tarea:', err);
      throw err;
    }
  };

  const transferTask = async (id, userId, reason) => {
    try {
      await bpmService.transferTask(id, userId, reason);
      setTasks(prev => prev.filter(t => t.id !== id));
      refreshTasks();
    } catch (err) {
      console.error('Error al transferir tarea:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    filters,
    stats,
    setFilters,
    fetchTasks,
    refreshTasks,
    completeTask,
    transferTask
  };
};
