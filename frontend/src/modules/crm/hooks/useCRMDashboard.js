import { useState, useEffect, useCallback } from 'react';
import crmService from '../services/crmService';

export const useCRMDashboard = (params = {}) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await crmService.getDashboardData(params);
      setDashboardData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el dashboard');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refetch = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch,
  };
};
