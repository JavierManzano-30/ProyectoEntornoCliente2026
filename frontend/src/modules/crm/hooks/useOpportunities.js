import { useState, useEffect, useCallback } from 'react';
import crmService from '../services/crmService';
import { filterOpportunities, sortOpportunities, groupOpportunitiesByStage } from '../utils/opportunityHelpers';

export const useOpportunities = (initialFilters = {}) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [groupedOpportunities, setGroupedOpportunities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('fechaCreacion');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await crmService.getOpportunities(filters);
      setOpportunities(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las oportunidades');
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  useEffect(() => {
    let result = filterOpportunities(opportunities, filters);
    result = sortOpportunities(result, sortBy, sortOrder);
    setFilteredOpportunities(result);
    setGroupedOpportunities(groupOpportunitiesByStage(result));
  }, [opportunities, filters, sortBy, sortOrder]);

  const refetch = useCallback(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

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

  const updateStage = useCallback(async (id, newStage) => {
    try {
      await crmService.updateOpportunityStage(id, newStage);
      await refetch();
    } catch (err) {
      console.error('Error updating opportunity stage:', err);
      throw err;
    }
  }, [refetch]);

  return {
    opportunities: filteredOpportunities,
    groupedOpportunities,
    allOpportunities: opportunities,
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
    updateStage,
  };
};
