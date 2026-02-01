/**
 * Hook para manejar la lista de tareas
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getTaskInbox(filters);
      setTasks(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completeTask = async (id, taskData) => {
    try {
      await bpmService.completeTask(id, taskData);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error al completar tarea:', err);
      throw err;
    }
  };

  const transferTask = async (id, userId, reason) => {
    try {
      await bpmService.transferTask(id, userId, reason);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error al transferir tarea:', err);
      throw err;
    }
  };

  const saveTaskDraft = async (id, draftData) => {
    try {
      await bpmService.saveTaskDraft(id, draftData);
    } catch (err) {
      console.error('Error al guardar borrador:', err);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    completeTask,
    transferTask,
    saveTaskDraft
  };
};
