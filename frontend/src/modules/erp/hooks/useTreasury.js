import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar tesorería y cuentas bancarias
 */
export const useTreasury = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar cuentas bancarias
  const loadBankAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getBankAccounts();
      setBankAccounts(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar movimientos de una cuenta
  const loadMovements = useCallback(async (accountId, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getBankMovements(accountId, filters);
      setMovements(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar conciliaciones
  const loadReconciliations = useCallback(async (accountId, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getBankReconciliations(accountId, filters);
      setReconciliations(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear cuenta bancaria
  const createAccount = useCallback(async (accountData) => {
    setLoading(true);
    setError(null);
    try {
      const newAccount = await erpService.createBankAccount(accountData);
      setBankAccounts(prev => [newAccount, ...prev]);
      return newAccount;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar movimiento
  const createMovement = useCallback(async (movementData) => {
    setLoading(true);
    setError(null);
    try {
      const newMovement = await erpService.createBankMovement(movementData);
      setMovements(prev => [newMovement, ...prev]);
      return newMovement;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear conciliación
  const createReconciliation = useCallback(async (reconciliationData) => {
    setLoading(true);
    setError(null);
    try {
      const newReconciliation = await erpService.createBankReconciliation(reconciliationData);
      setReconciliations(prev => [newReconciliation, ...prev]);
      return newReconciliation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener previsión de tesorería
  const getForecast = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getCashFlowForecast(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener posición de tesorería
  const getPosition = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getTreasuryPosition(date);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bankAccounts,
    movements,
    reconciliations,
    loading,
    error,
    loadBankAccounts,
    loadMovements,
    loadReconciliations,
    createAccount,
    createMovement,
    createReconciliation,
    getForecast,
    getPosition
  };
};

export default useTreasury;
