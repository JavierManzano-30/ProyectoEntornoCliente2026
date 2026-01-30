import { useState, useEffect, useCallback } from 'react';
import crmService from '../services/crmService';
import { filterCustomers, sortCustomers } from '../utils/customerHelpers';

export const useCustomers = (initialFilters = {}) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('fechaCreacion');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await crmService.getCustomers(filters);
      setCustomers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los clientes');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    let result = filterCustomers(customers, filters);
    result = sortCustomers(result, sortBy, sortOrder);
    setFilteredCustomers(result);
  }, [customers, filters, sortBy, sortOrder]);

  const refetch = useCallback(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const toggleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    loading,
    error,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    refetch,
    sortBy,
    sortOrder,
    toggleSort,
  };
};
