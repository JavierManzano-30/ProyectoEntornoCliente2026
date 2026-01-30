import { useState, useEffect, useCallback } from 'react';
import { getAbsences, approveAbsence, rejectAbsence, createAbsence } from '../services/rrhhService';
import { filterAbsences, calculateAbsenceStats } from '../utils/absenceCalculations';

export const useAbsences = (initialFilters = {}) => {
  const [absences, setAbsences] = useState([]);
  const [filteredAbsences, setFilteredAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: '',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    ...initialFilters,
  });

  // Cargar ausencias
  const fetchAbsences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAbsences();
      setAbsences(data);
    } catch (err) {
      setError(err.message || 'Error al cargar ausencias');
      console.error('Error fetching absences:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros
  useEffect(() => {
    const result = filterAbsences(absences, filters);
    setFilteredAbsences(result);
  }, [absences, filters]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  // Aprobar ausencia
  const handleApprove = useCallback(async (absenceId, comments = '') => {
    try {
      await approveAbsence(absenceId, comments);
      await fetchAbsences(); // Recargar lista
      return true;
    } catch (err) {
      setError(err.message || 'Error al aprobar la ausencia');
      console.error('Error approving absence:', err);
      throw err;
    }
  }, [fetchAbsences]);

  // Rechazar ausencia
  const handleReject = useCallback(async (absenceId, reason) => {
    try {
      await rejectAbsence(absenceId, reason);
      await fetchAbsences(); // Recargar lista
      return true;
    } catch (err) {
      setError(err.message || 'Error al rechazar la ausencia');
      console.error('Error rejecting absence:', err);
      throw err;
    }
  }, [fetchAbsences]);

  // Crear ausencia
  const handleCreate = useCallback(async (absenceData) => {
    try {
      const newAbsence = await createAbsence(absenceData);
      await fetchAbsences(); // Recargar lista
      return newAbsence;
    } catch (err) {
      setError(err.message || 'Error al crear la ausencia');
      console.error('Error creating absence:', err);
      throw err;
    }
  }, [fetchAbsences]);

  // Calcular estadísticas
  const stats = calculateAbsenceStats(absences);

  return {
    absences: filteredAbsences,
    allAbsences: absences,
    loading,
    error,
    filters,
    setFilters,
    stats,
    handleApprove,
    handleReject,
    handleCreate,
    refetch: fetchAbsences,
  };
};
