import { useState, useEffect, useCallback } from 'react';
import { getPayrolls, downloadPayrollPDF } from '../services/rrhhService';
import { filterPayrolls, sortPayrollsByDate, calculatePayrollStats } from '../utils/payrollFormatters';

export const usePayrolls = (initialFilters = {}) => {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [filters, setFilters] = useState({
    employeeId: '',
    year: '',
    month: '',
    search: '',
    ...initialFilters,
  });

  // Cargar nóminas
  const fetchPayrolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPayrolls();
      setPayrolls(data);
    } catch (err) {
      setError(err.message || 'Error al cargar nóminas');
      console.error('Error fetching payrolls:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = filterPayrolls(payrolls, filters);
    result = sortPayrollsByDate(result, 'desc');
    setFilteredPayrolls(result);
  }, [payrolls, filters]);

  // Cargar datos inicialmente
  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  // Descargar PDF de nómina
  const handleDownloadPDF = useCallback(async (payrollId, filename) => {
    try {
      setDownloading(true);
      const blob = await downloadPayrollPDF(payrollId);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `nomina_${payrollId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError(err.message || 'Error al descargar la nómina');
      console.error('Error downloading payroll PDF:', err);
      throw err;
    } finally {
      setDownloading(false);
    }
  }, []);

  // Calcular estadísticas
  const stats = calculatePayrollStats(payrolls);

  return {
    payrolls: filteredPayrolls,
    allPayrolls: payrolls,
    loading,
    error,
    downloading,
    filters,
    setFilters,
    stats,
    handleDownloadPDF,
    refetch: fetchPayrolls,
  };
};
