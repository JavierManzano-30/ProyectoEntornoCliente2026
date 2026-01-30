import { useState, useEffect, useCallback } from 'react';
import crmService from '../services/crmService';
import { filterLeads, sortLeads } from '../utils/leadHelpers';

export const useLeads = (initialFilters = {}) => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('fechaCreacion');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await crmService.getLeads(filters);
      setLeads(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    let result = filterLeads(leads, filters);
    result = sortLeads(result, sortBy, sortOrder);
    setFilteredLeads(result);
  }, [leads, filters, sortBy, sortOrder]);

  const refetch = useCallback(() => {
    fetchLeads();
  }, [fetchLeads]);

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
    leads: filteredLeads,
    allLeads: leads,
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
