import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar órdenes de compra y proveedores
 */
export const usePurchases = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar órdenes de compra
  const loadPurchaseOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getPurchaseOrders(filters);
      setPurchaseOrders(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar proveedores
  const loadVendors = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getVendors(filters);
      setVendors(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear orden de compra
  const createPurchaseOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await erpService.createPurchaseOrder(orderData);
      setPurchaseOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirmar orden de compra
  const confirmOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await erpService.confirmPurchaseOrder(orderId);
      setPurchaseOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar recepción
  const createReceipt = useCallback(async (receiptData) => {
    setLoading(true);
    setError(null);
    try {
      const receipt = await erpService.createGoodsReceipt(receiptData);
      // Actualizar estado de la orden si está en el listado
      if (receiptData.orderId) {
        setPurchaseOrders(prev => prev.map(o => 
          o.id === receiptData.orderId ? { ...o, status: 'received' } : o
        ));
      }
      return receipt;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    purchaseOrders,
    vendors,
    loading,
    error,
    loadPurchaseOrders,
    loadVendors,
    createPurchaseOrder,
    confirmOrder,
    createReceipt
  };
};

export default usePurchases;
