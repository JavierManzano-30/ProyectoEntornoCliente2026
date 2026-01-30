import { useState, useEffect, useCallback } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/rrhhService';

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Cargar departamentos
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err.message || 'Error al cargar departamentos');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Crear departamento
  const handleCreate = useCallback(async (departmentData) => {
    try {
      setProcessing(true);
      setError(null);
      const newDepartment = await createDepartment(departmentData);
      await fetchDepartments(); // Recargar lista
      return newDepartment;
    } catch (err) {
      setError(err.message || 'Error al crear el departamento');
      console.error('Error creating department:', err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [fetchDepartments]);

  // Actualizar departamento
  const handleUpdate = useCallback(async (departmentId, updates) => {
    try {
      setProcessing(true);
      setError(null);
      const updatedDepartment = await updateDepartment(departmentId, updates);
      await fetchDepartments(); // Recargar lista
      return updatedDepartment;
    } catch (err) {
      setError(err.message || 'Error al actualizar el departamento');
      console.error('Error updating department:', err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [fetchDepartments]);

  // Eliminar departamento
  const handleDelete = useCallback(async (departmentId) => {
    try {
      setProcessing(true);
      setError(null);
      await deleteDepartment(departmentId);
      await fetchDepartments(); // Recargar lista
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar el departamento');
      console.error('Error deleting department:', err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, [fetchDepartments]);

  // Construir árbol jerárquico de departamentos
  const buildDepartmentTree = useCallback(() => {
    if (!departments || departments.length === 0) return [];

    const departmentMap = new Map();
    const rootDepartments = [];

    // Crear mapa de departamentos
    departments.forEach(dept => {
      departmentMap.set(dept.id, { ...dept, children: [] });
    });

    // Construir jerarquía
    departments.forEach(dept => {
      const node = departmentMap.get(dept.id);
      if (dept.parentId) {
        const parent = departmentMap.get(dept.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          rootDepartments.push(node);
        }
      } else {
        rootDepartments.push(node);
      }
    });

    return rootDepartments;
  }, [departments]);

  return {
    departments,
    departmentTree: buildDepartmentTree(),
    loading,
    error,
    processing,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch: fetchDepartments,
  };
};
