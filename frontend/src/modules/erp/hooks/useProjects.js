import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar proyectos de coste y centros de coste
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar proyectos
  const loadProjects = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getCostProjects(filters);
      setProjects(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear proyecto
  const createProject = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const newProject = await erpService.createCostProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar imputación
  const createAllocation = useCallback(async (allocationData) => {
    setLoading(true);
    setError(null);
    try {
      const allocation = await erpService.createCostAllocation(allocationData);
      return allocation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener comparación presupuesto vs real
  const getBudgetComparison = useCallback(async (projectId, params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getProjectBudgetComparison(projectId, params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener análisis de rentabilidad
  const getProfitability = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getProjectProfitability(projectId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject,
    createAllocation,
    getBudgetComparison,
    getProfitability
  };
};

export default useProjects;
