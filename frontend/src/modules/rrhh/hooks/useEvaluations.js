import { useState, useEffect, useCallback } from 'react';
import { getEmployeeEvaluations, createEvaluation } from '../services/rrhhService';

export const useEvaluations = (employeeId) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  // Cargar evaluaciones
  const fetchEvaluations = useCallback(async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getEmployeeEvaluations(employeeId);
      setEvaluations(data);
    } catch (err) {
      setError(err.message || 'Error al cargar evaluaciones');
      console.error('Error fetching evaluations:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  // Crear evaluación
  const handleCreate = useCallback(async (evaluationData) => {
    try {
      setCreating(true);
      setError(null);
      const newEvaluation = await createEvaluation({
        ...evaluationData,
        employeeId,
      });
      await fetchEvaluations(); // Recargar lista
      return newEvaluation;
    } catch (err) {
      setError(err.message || 'Error al crear la evaluación');
      console.error('Error creating evaluation:', err);
      throw err;
    } finally {
      setCreating(false);
    }
  }, [employeeId, fetchEvaluations]);

  // Obtener última evaluación
  const getLatestEvaluation = useCallback(() => {
    if (!evaluations || evaluations.length === 0) return null;
    
    return evaluations.reduce((latest, current) => {
      const latestDate = new Date(latest.evaluationDate);
      const currentDate = new Date(current.evaluationDate);
      return currentDate > latestDate ? current : latest;
    });
  }, [evaluations]);

  // Calcular promedio de evaluación
  const calculateAverageScore = useCallback((evaluation) => {
    if (!evaluation || !evaluation.scores) return 0;
    
    const scores = Object.values(evaluation.scores);
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((total, score) => total + score, 0);
    return (sum / scores.length).toFixed(2);
  }, []);

  return {
    evaluations,
    latestEvaluation: getLatestEvaluation(),
    loading,
    error,
    creating,
    handleCreate,
    calculateAverageScore,
    refetch: fetchEvaluations,
  };
};
