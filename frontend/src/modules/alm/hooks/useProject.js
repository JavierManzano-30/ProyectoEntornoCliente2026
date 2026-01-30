import { useState, useEffect } from 'react';
import { getProject, getProjectStats } from '../services/almService';

export const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [projectResponse, statsResponse] = await Promise.all([
        getProject(id),
        getProjectStats(id)
      ]);
      
      setProject(projectResponse.data);
      setTasks(statsResponse.data.tareas || []);
      setTimeEntries(statsResponse.data.registrosTiempo || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar proyecto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  return { project, tasks, timeEntries, loading, error, refetch: fetchProject };
};
