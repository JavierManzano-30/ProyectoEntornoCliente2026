import { useState, useEffect, useCallback } from 'react';
import { getEmployees } from '../services/rrhhService';
import { filterEmployees, sortEmployees, calculateEmployeeStats } from '../utils/employeeHelpers';

export const useEmployees = (initialFilters = {}) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    position: '',
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

  // Cargar empleados
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Error al cargar empleados');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = filterEmployees(employees, filters);
    result = sortEmployees(result, sortConfig.sortBy, sortConfig.sortOrder);
    
    setFilteredEmployees(result);
    setPagination(prev => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.itemsPerPage),
      currentPage: 1, // Reset a la primera página cuando cambian los filtros
    }));
  }, [employees, filters, sortConfig]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Obtener empleados paginados
  const getPaginatedEmployees = useCallback(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, pagination]);

  // Cambiar página
  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage,
    }));
  }, []);

  // Cambiar items por página
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
      totalPages: Math.ceil(filteredEmployees.length / newItemsPerPage),
    }));
  }, [filteredEmployees]);

  // Búsqueda
  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
    }));
  }, []);

  // Ordenamiento
  const handleSort = useCallback((sortBy) => {
    setSortConfig(prev => ({
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Calcular estadísticas
  const stats = calculateEmployeeStats(employees);

  return {
    employees: getPaginatedEmployees(),
    allEmployees: employees,
    filteredEmployees,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
    sortConfig,
    handleSort,
    stats,
    refetch: fetchEmployees,
  };
};
