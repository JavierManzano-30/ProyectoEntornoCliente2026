import { useState, useEffect, useCallback } from 'react';
import soporteService from '../services/soporteService';

export const useSupportDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboard, statistics] = await Promise.all([
        soporteService.getDashboardData(),
        soporteService.getStats(),
      ]);
      
      setDashboardData(dashboard);
      setStats(statistics);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el dashboard');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    stats,
    loading,
    error,
    refetch,
  };
};
