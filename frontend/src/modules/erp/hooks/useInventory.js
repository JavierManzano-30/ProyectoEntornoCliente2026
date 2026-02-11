import { useState, useCallback } from 'react';
import erpService from '../services/erpService';

/**
 * Hook para gestionar productos, stock y movimientos de inventario
 */
export const useInventory = () => {
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [movements, setMovements] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar productos
  const loadProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getProducts(filters);
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar niveles de stock
  const loadStockLevels = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getStockLevels(filters);
      setStockLevels(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar movimientos
  const loadMovements = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getInventoryMovements(filters);
      setMovements(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar almacenes
  const loadWarehouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getWarehouses();
      setWarehouses(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear producto
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await erpService.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar movimiento
  const createMovement = useCallback(async (movementData) => {
    setLoading(true);
    setError(null);
    try {
      const newMovement = await erpService.createInventoryMovement(movementData);
      setMovements(prev => [newMovement, ...prev]);
      // Actualizar stock si tenemos los datos
      await loadStockLevels();
      return newMovement;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStockLevels]);

  // Obtener valoración de inventario
  const getValuation = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await erpService.getInventoryValuation(params);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    stockLevels,
    movements,
    warehouses,
    loading,
    error,
    loadProducts,
    loadStockLevels,
    loadMovements,
    loadWarehouses,
    createProduct,
    createMovement,
    getValuation
  };
};

export default useInventory;
