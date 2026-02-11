import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '../services/coreService';
import { filterUsers, sortUsers, calculateUserStats } from '../utils/userHelpers';

export const useUsers = (initialFilters = {}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    rol: '',
    estado: '',
    departamento: '',
    ...initialFilters,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = filterUsers(users, filters);
    result = sortUsers(result, sortConfig.sortBy, sortConfig.sortOrder);
    
    setFilteredUsers(result);
    setPagination(prev => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.itemsPerPage),
    }));
  }, [users, filters, sortConfig]);

  // Cargar datos al montar
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  // Calcular estadísticas
  const stats = calculateUserStats(users);

  // Usuarios paginados
  const paginatedUsers = filteredUsers.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  return {
    users: paginatedUsers,
    allUsers: filteredUsers,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    handlePageChange,
    handleSearch,
    handleSort,
    sortConfig,
    stats,
    refetch,
  };
};
