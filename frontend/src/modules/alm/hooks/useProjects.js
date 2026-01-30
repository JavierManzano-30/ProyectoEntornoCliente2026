import { useState, useEffect } from 'react';
import { getProjects } from '../services/almService';
import { filterProjects, sortProjects, calculateProjectStats } from '../utils/projectHelpers';

export const useProjects = (initialFilters = {}) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = filterProjects(projects, filters);
    result = sortProjects(result, sortBy, sortOrder);
    setFilteredProjects(result);
  }, [projects, filters, sortBy, sortOrder]);

  const stats = calculateProjectStats(filteredProjects);

  return {
    projects: filteredProjects,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    stats,
    loading,
    error,
    refetch: fetchProjects
  };
};
