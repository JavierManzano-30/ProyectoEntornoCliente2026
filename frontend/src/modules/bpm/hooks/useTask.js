/**
 * Hook para manejar una tarea individual
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useTask = (taskId) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getTaskById(taskId);
      setTask(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar tarea:', err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const completeTask = async (taskData) => {
    if (!taskId) return;
    
    try {
      await bpmService.completeTask(taskId, taskData);
      setTask(prev => ({ ...prev, estado: 'completada' }));
    } catch (err) {
      console.error('Error al completar tarea:', err);
      throw err;
    }
  };

  const transferTask = async (userId, reason) => {
    if (!taskId) return;
    
    try {
      await bpmService.transferTask(taskId, userId, reason);
      setTask(prev => ({ ...prev, estado: 'transferida' }));
    } catch (err) {
      console.error('Error al transferir tarea:', err);
      throw err;
    }
  };

  const saveTaskDraft = async (draftData) => {
    if (!taskId) return;
    
    try {
      await bpmService.saveTaskDraft(taskId, draftData);
    } catch (err) {
      console.error('Error al guardar borrador:', err);
      throw err;
    }
  };

  const requestInformation = async (message) => {
    if (!taskId) return;
    
    try {
      await bpmService.requestTaskInformation(taskId, message);
      setTask(prev => ({ ...prev, estado: 'info_solicitada' }));
    } catch (err) {
      console.error('Error al solicitar información:', err);
      throw err;
    }
  };

  return {
    task,
    loading,
    error,
    fetchTask,
    completeTask,
    transferTask,
    saveTaskDraft,
    requestInformation
  };
};
