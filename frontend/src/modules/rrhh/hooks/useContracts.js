import { useState, useEffect, useCallback } from 'react';
import { getEmployeeContracts, createContract, terminateContract } from '../services/rrhhService';

export const useContracts = (employeeId) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Cargar contratos
  const fetchContracts = useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getEmployeeContracts(employeeId);
      setContracts(data);
    } catch (err) {
      setError(err.message || 'Error al cargar contratos');
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Crear contrato
  const handleCreate = useCallback(async (contractData) => {
    try {
      setProcessing(true);
      setError(null);
      const newContract = await createContract({
        ...contractData,
        employeeId,
      });
      await fetchContracts(); // Recargar lista
      return newContract;
    } catch (err) {
      setError(err.message || 'Error al crear el contrato');
      console.error('Error creating contract:', err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [employeeId, fetchContracts]);

  // Terminar contrato
  const handleTerminate = useCallback(async (contractId, terminationData) => {
    try {
      setProcessing(true);
      setError(null);
      await terminateContract(contractId, terminationData);
      await fetchContracts(); // Recargar lista
      return true;
    } catch (err) {
      setError(err.message || 'Error al terminar el contrato');
      console.error('Error terminating contract:', err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [fetchContracts]);

  // Obtener contrato activo
  const getActiveContract = useCallback(() => {
    return contracts.find(contract => contract.status === 'active');
  }, [contracts]);

  return {
    contracts,
    activeContract: getActiveContract(),
    loading,
    error,
    processing,
    handleCreate,
    handleTerminate,
    refetch: fetchContracts,
  };
};
