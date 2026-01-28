import { useState, useEffect, useCallback } from "react";
import { biService } from "../services/biService";

export const useAlerts = (initialFilters = {}) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await biService.getAllAlerts(filters);
      setAlerts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    filters,
    setFilters,
    fetchAlerts,
  };
};
