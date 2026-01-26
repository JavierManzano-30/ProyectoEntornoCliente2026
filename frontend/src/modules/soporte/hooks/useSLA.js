import { useState, useEffect, useCallback } from 'react';
import soporteService from '../services/soporteService';

export const useSLA = () => {
  const [slaList, setSlaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSLAList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await soporteService.getSLAList();
      setSlaList(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los SLA');
      console.error('Error fetching SLA list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSLAList();
  }, [fetchSLAList]);

  const refetch = useCallback(() => {
    fetchSLAList();
  }, [fetchSLAList]);

  return {
    slaList,
    loading,
    error,
    refetch,
  };
};
