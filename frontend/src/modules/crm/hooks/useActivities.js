import { useState, useEffect, useCallback } from 'react';
import crmService from '../services/crmService';
import { filterActivities, sortActivities } from '../utils/activityHelpers';

export const useActivities = (initialFilters = {}) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('fechaProgramada');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await crmService.getActivities(filters);
      setActivities(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las actividades');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    let result = filterActivities(activities, filters);
    result = sortActivities(result, sortBy, sortOrder);
    setFilteredActivities(result);
  }, [activities, filters, sortBy, sortOrder]);

  const refetch = useCallback(() => {
    fetchActivities();
  }, [fetchActivities]);

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

  const completeActivity = useCallback(async (id) => {
    try {
      await crmService.completeActivity(id);
      await refetch();
    } catch (err) {
      console.error('Error completing activity:', err);
      throw err;
    }
  }, [refetch]);

  return {
    activities: filteredActivities,
    allActivities: activities,
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
    completeActivity,
  };
};
