import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '../services/coreService';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Error al cargar dashboard');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refetch = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = dashboardData ? {
    totalUsuarios: dashboardData.totalUsuarios || 0,
    usuariosActivos: dashboardData.usuariosActivos || 0,
    usuariosNuevos: dashboardData.usuariosNuevos || 0,
    totalEmpresas: dashboardData.totalEmpresas || 0,
    empresasActivas: dashboardData.empresasActivas || 0,
    sesionesActivas: dashboardData.sesionesActivas || 0,
  } : null;

  return {
    dashboardData,
    stats,
    loading,
    error,
    refetch,
  };
};
