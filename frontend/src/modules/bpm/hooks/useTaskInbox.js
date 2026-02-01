/**
 * Hook para manejar la bandeja de tareas con polling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { bpmService } from '../services/bpmService';

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

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getTaskInbox(filters);
      const taskList = data.data || data;
      setTasks(taskList);
      
      // Calcular estadísticas
      setStats({
        total: taskList.length,
        pending: taskList.filter(t => t.estado === 'pending' || t.estado === 'assigned').length,
        inProgress: taskList.filter(t => t.estado === 'in_progress').length,
        overdue: taskList.filter(t => {
          if (!t.fecha_limite) return false;
          return new Date(t.fecha_limite) < new Date() && t.estado !== 'completed';
        }).length
      });
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar bandeja:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

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
