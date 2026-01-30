import { useState, useEffect } from 'react';
import { getTasks } from '../services/almService';
import { filterTasks, sortTasks, calculateTaskStats } from '../utils/taskHelpers';

export const useTasks = (initialFilters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('fechaCreacion');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(filters.proyectoId ? { proyectoId: filters.proyectoId } : {});
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters.proyectoId]);

  useEffect(() => {
    let result = filterTasks(tasks, filters);
    result = sortTasks(result, sortBy, sortOrder);
    setFilteredTasks(result);
  }, [tasks, filters, sortBy, sortOrder]);

  const stats = calculateTaskStats(filteredTasks);

  return {
    tasks: filteredTasks,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    stats,
    loading,
    error,
    refetch: fetchTasks
  };
};
