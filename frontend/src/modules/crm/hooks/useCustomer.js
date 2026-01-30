import { useState, useEffect, useCallback } from 'react';
import crmService from '../services/crmService';

export const useCustomer = (id) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await crmService.getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el cliente');
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const updateCustomer = useCallback(async (customerData) => {
    try {
      setError(null);
      const updated = await crmService.updateCustomer(id, customerData);
      setCustomer(updated);
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el cliente');
      throw err;
    }
  }, [id]);

  const deleteCustomer = useCallback(async () => {
    try {
      setError(null);
      await crmService.deleteCustomer(id);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el cliente');
      throw err;
    }
  }, [id]);

  const refetch = useCallback(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return {
    customer,
    loading,
    error,
    updateCustomer,
    deleteCustomer,
    refetch,
  };
};
