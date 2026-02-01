import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar reportes financieros
 */
export const useReporting = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener balance general
  const getBalanceSheet = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getBalanceSheet(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estado de resultados
  const getIncomeStatement = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getIncomeStatement(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener flujo de efectivo
  const getCashFlowStatement = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getCashFlowStatement(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener análisis de costes
  const getCostAnalysis = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getCostAnalysis(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener KPIs financieros
  const getKPIs = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getFinancialKPIs(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Exportar reporte a PDF
  const exportPDF = useCallback(async (reportType, params) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await erpService.exportReportPDF(reportType, params);
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Exportar reporte a Excel
  const exportExcel = useCallback(async (reportType, params) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await erpService.exportReportExcel(reportType, params);
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getBalanceSheet,
    getIncomeStatement,
    getCashFlowStatement,
    getCostAnalysis,
    getKPIs,
    exportPDF,
    exportExcel
  };
};

export default useReporting;
