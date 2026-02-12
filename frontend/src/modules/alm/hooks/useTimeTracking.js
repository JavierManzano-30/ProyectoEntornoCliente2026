import { useState, useEffect } from 'react';
import { getTimeEntries, getALMStats, getProjects, getTasks } from '../services/almService';

export const useTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalHoras: 0,
    entradasHoy: 0,
    promedioHoras: 0,
    proyectosActivos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [entriesResponse, statsResponse, projectsResponse, tasksResponse] = await Promise.all([
        getTimeEntries(),
        getALMStats(),
        getProjects(),
        getTasks(),
      ]);

      const entries = entriesResponse.data || [];
      const almStats = statsResponse.data || {};
      const projectsData = projectsResponse.data || [];
      const tasksData = tasksResponse.data || [];

      const projectMap = new Map(projectsData.map((project) => [project.id, project]));
      const taskMap = new Map(tasksData.map((task) => [task.id, task]));

      const enrichedEntries = entries.map((entry) => {
        const task = taskMap.get(entry.tareaId);
        const projectId = entry.proyectoId || task?.proyectoId || '';
        const project = projectMap.get(projectId);

        return {
          ...entry,
          proyectoId: projectId,
          proyectoNombre: project?.nombre || '-',
          tareaNombre: task?.nombre || '-',
        };
      });

      setTimeEntries(enrichedEntries);
      setProjects(projectsData);
      setTasks(tasksData);

      const totalHoras = enrichedEntries.reduce((sum, entry) => sum + parseFloat(entry.horas || 0), 0);
      const today = new Date().toISOString().split('T')[0];
      const entradasHoy = enrichedEntries.filter((entry) => entry.fecha === today).length;
      const promedioHoras = enrichedEntries.length > 0 ? totalHoras / enrichedEntries.length : 0;

      setStats({
        totalHoras: totalHoras.toFixed(2),
        entradasHoy,
        promedioHoras,
        proyectosActivos: almStats.proyectosActivos || 0,
      });

      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos de tiempo');
      console.error('Error fetching time entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { timeEntries, projects, tasks, stats, loading, error, refetch: fetchData };
};
