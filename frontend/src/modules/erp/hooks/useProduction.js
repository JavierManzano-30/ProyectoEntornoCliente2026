import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar órdenes de producción y BOMs
 */
export const useProduction = () => {
  const [productionOrders, setProductionOrders] = useState([]);
  const [boms, setBoms] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar órdenes de producción
  const loadProductionOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getProductionOrders(filters);
      setProductionOrders(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar BOMs
  const loadBOMs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getBOMs(filters);
      setBoms(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar rutas
  const loadRoutes = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getRoutes(filters);
      setRoutes(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear orden de producción
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await erpService.createProductionOrder(orderData);
      setProductionOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Liberar orden
  const releaseOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await erpService.releaseProductionOrder(orderId);
      setProductionOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Completar orden
  const completeOrder = useCallback(async (orderId, completionData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await erpService.completeProductionOrder(orderId, completionData);
      setProductionOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear BOM
  const createBOM = useCallback(async (bomData) => {
    setLoading(true);
    setError(null);
    try {
      const newBOM = await erpService.createBOM(bomData);
      setBoms(prev => [newBOM, ...prev]);
      return newBOM;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    productionOrders,
    boms,
    routes,
    loading,
    error,
    loadProductionOrders,
    loadBOMs,
    loadRoutes,
    createOrder,
    releaseOrder,
    completeOrder,
    createBOM
  };
};

export default useProduction;
