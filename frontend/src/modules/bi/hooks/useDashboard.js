import { useState, useEffect, useCallback } from "react";
import { biService } from "../services/biService";

export const useDashboard = (dashboardType = "global", initialFilters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData =
        dashboardType === "global"
          ? await biService.getGlobalDashboard(filters)
          : await biService.getModuleDashboard(dashboardType, filters);
      setData(dashboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dashboardType, filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const refreshDashboard = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refreshDashboard,
  };
};
