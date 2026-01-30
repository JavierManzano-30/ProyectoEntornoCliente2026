import { useState, useEffect, useCallback } from 'react';
import { getEmployee, updateEmployee, deactivateEmployee } from '../services/rrhhService';

export const useEmployee = (employeeId) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Cargar empleado
  const fetchEmployee = useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getEmployee(employeeId);
      setEmployee(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el empleado');
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  // Actualizar empleado
  const updateEmployeeData = useCallback(async (updates) => {
    if (!employeeId) return;

    try {
      setUpdating(true);
      setError(null);
      const updatedEmployee = await updateEmployee(employeeId, updates);
      setEmployee(updatedEmployee);
      return updatedEmployee;
    } catch (err) {
      setError(err.message || 'Error al actualizar el empleado');
      console.error('Error updating employee:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [employeeId]);

  // Desactivar empleado
  const deactivate = useCallback(async () => {
    if (!employeeId) return;

    try {
      setUpdating(true);
      setError(null);
      const deactivatedEmployee = await deactivateEmployee(employeeId);
      setEmployee(deactivatedEmployee);
      return deactivatedEmployee;
    } catch (err) {
      setError(err.message || 'Error al desactivar el empleado');
      console.error('Error deactivating employee:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [employeeId]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return {
    employee,
    loading,
    error,
    updating,
    updateEmployeeData,
    deactivate,
    refetch: fetchEmployee,
  };
};
