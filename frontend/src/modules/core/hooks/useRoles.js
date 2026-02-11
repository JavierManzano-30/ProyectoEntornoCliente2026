import { useState, useEffect, useCallback } from 'react';
import { getRoles } from '../services/coreService';
import { filterRoles, sortRoles, calculateRoleStats } from '../utils/roleHelpers';

export const useRoles = (initialFilters = {}) => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    editable: undefined,
    ...initialFilters,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'nombre',
    sortOrder: 'asc',
  });

  // Cargar roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setError(err.message || 'Error al cargar roles');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = filterRoles(roles, filters);
    result = sortRoles(result, sortConfig.sortBy, sortConfig.sortOrder);
    setFilteredRoles(result);
  }, [roles, filters, sortConfig]);

  // Cargar datos al montar
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const refetch = useCallback(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Calcular estadísticas
  const stats = calculateRoleStats(roles);

  return {
    roles: filteredRoles,
    allRoles: roles,
    loading,
    error,
    filters,
    setFilters,
    handleSearch,
    handleSort,
    sortConfig,
    stats,
    refetch,
  };
};
