import { useState, useEffect, useCallback } from "react";
import { biService } from "../services/biService";

export const useDatasets = (initialFilters = {}) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await biService.getAllDatasets(filters);
      setDatasets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  return {
    datasets,
    loading,
    error,
    filters,
    setFilters,
    fetchDatasets,
  };
};
