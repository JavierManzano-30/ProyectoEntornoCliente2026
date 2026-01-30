import { useState, useEffect } from 'react';
import { getTimeEntries, getALMStats } from '../services/almService';

export const useTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [stats, setStats] = useState({
    totalHoras: 0,
    entradasHoy: 0,
    promedioHoras: 0,
    proyectosActivos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const entries = await getTimeEntries();
        const almStats = await getALMStats();

        setTimeEntries(entries);
        
        // Calcular estadísticas
        const totalHoras = entries.reduce((sum, e) => sum + parseFloat(e.horas || 0), 0);
        const today = new Date().toISOString().split('T')[0];
        const entradasHoy = entries.filter(e => e.fecha === today).length;
        const promedioHoras = entries.length > 0 ? totalHoras / entries.length : 0;
        
        setStats({
          totalHoras: totalHoras.toFixed(2),
          entradasHoy,
          promedioHoras,
          proyectosActivos: almStats.proyectosActivos || 3
        });
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar datos de tiempo');
        console.error('Error fetching time entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { timeEntries, stats, loading, error };
};
