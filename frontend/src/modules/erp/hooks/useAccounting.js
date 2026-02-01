import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar el plan contable y asientos
 */
export const useAccounting = () => {
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar plan contable
  const loadChartOfAccounts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getChartOfAccounts(filters);
      setChartOfAccounts(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar asientos contables
  const loadJournalEntries = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getJournalEntries(filters);
      setJournalEntries(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear asiento contable
  const createEntry = useCallback(async (entryData) => {
    setLoading(true);
    setError(null);
    try {
      const newEntry = await erpService.createJournalEntry(entryData);
      setJournalEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Contabilizar asiento
  const postEntry = useCallback(async (entryId) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await erpService.postJournalEntry(entryId);
      setJournalEntries(prev => prev.map(e => e.id === entryId ? updated : e));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener balance de comprobación
  const getTrialBalance = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getTrialBalance(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    chartOfAccounts,
    journalEntries,
    loading,
    error,
    loadChartOfAccounts,
    loadJournalEntries,
    createEntry,
    postEntry,
    getTrialBalance
  };
};

export default useAccounting;
