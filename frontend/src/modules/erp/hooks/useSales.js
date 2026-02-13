import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar facturas de venta y cuentas por cobrar
 */
export const useSales = () => {
  const [invoices, setInvoices] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar facturas
  const loadInvoices = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getSalesInvoices(filters);
      setInvoices(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar cuentas por cobrar
  const loadReceivables = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getAccountsReceivable(filters);
      setReceivables(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear factura
  const createInvoice = useCallback(async (invoiceData) => {
    setLoading(true);
    setError(null);
    try {
      const newInvoice = await erpService.createSalesInvoice(invoiceData);
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar factura por email
  const sendInvoice = useCallback(async (invoiceId, emailData) => {
    setLoading(true);
    setError(null);
    try {
      await erpService.sendInvoiceEmail(invoiceId, emailData);
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'issued' } : inv
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar pago
  const recordPayment = useCallback(async (invoiceId, paymentData) => {
    setLoading(true);
    setError(null);
    try {
      await erpService.recordInvoicePayment(invoiceId, paymentData);
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
      ));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener reporte de antigüedad
  const getAgingReport = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getAgingReport(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    invoices,
    receivables,
    loading,
    error,
    loadInvoices,
    loadReceivables,
    createInvoice,
    sendInvoice,
    recordPayment,
    getAgingReport
  };
};

export default useSales;
