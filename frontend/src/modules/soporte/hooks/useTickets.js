import { useState, useEffect, useCallback } from 'react';
import soporteService from '../services/soporteService';
import { filterTickets, sortTickets } from '../utils/ticketHelpers';

export const useTickets = (initialFilters = {}) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('fechaCreacion');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await soporteService.getTickets(filters);
      setTickets(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    let result = filterTickets(tickets, filters);
    result = sortTickets(result, sortBy, sortOrder);
    setFilteredTickets(result);
  }, [tickets, filters, sortBy, sortOrder]);

  const refetch = useCallback(() => {
    fetchTickets();
  }, [fetchTickets]);

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
    tickets: filteredTickets,
    allTickets: tickets,
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
