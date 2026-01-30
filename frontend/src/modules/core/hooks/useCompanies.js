import { useState, useEffect, useCallback } from 'react';
import { getCompanies } from '../services/coreService';
import { filterCompanies, sortCompanies, calculateCompanyStats } from '../utils/companyHelpers';

export const useCompanies = (initialFilters = {}) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: '',
    sector: '',
    ciudad: '',
    ...initialFilters,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'nombre',
    sortOrder: 'asc',
  });

  // Cargar empresas
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err.message || 'Error al cargar empresas');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = filterCompanies(companies, filters);
    result = sortCompanies(result, sortConfig.sortBy, sortConfig.sortOrder);
    
    setFilteredCompanies(result);
    setPagination(prev => ({
      ...prev,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.itemsPerPage),
    }));
  }, [companies, filters, sortConfig]);

  // Cargar datos al montar
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const refetch = useCallback(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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
  const stats = calculateCompanyStats(companies);

  // Empresas paginadas
  const paginatedCompanies = filteredCompanies.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  return {
    companies: paginatedCompanies,
    allCompanies: filteredCompanies,
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
