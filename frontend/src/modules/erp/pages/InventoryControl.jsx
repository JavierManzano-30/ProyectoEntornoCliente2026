import { useEffect, useState } from 'react';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { useInventory } from '../hooks';
import { formatCurrency, formatNumber } from '../utils';
import './InventoryControl.css';

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Página de Control de Inventario
 * Gestión de productos y stock
 */
const InventoryControl = () => {
  const { products, stockLevels, loading, loadProducts, loadStockLevels } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const stockByProductId = stockLevels.reduce((acc, stock) => {
    const productId = stock.productId || stock.product_id;
    if (!productId) return acc;
    const previous = acc[productId] || { current: 0, min: 0, max: 0 };
    acc[productId] = {
      current: previous.current + toNumber(stock.quantityAvailable ?? stock.quantity_available),
      min: previous.min + toNumber(stock.minimumQuantity ?? stock.minimum_quantity),
      max: previous.max + toNumber(stock.maximumQuantity ?? stock.maximum_quantity)
    };
    return acc;
  }, {});

  useEffect(() => {
    loadProducts();
    loadStockLevels();
  }, [loadProducts, loadStockLevels]);

  const getStockStatus = (current, min, max) => {
    if (current <= min) return 'low';
    if (max > 0 && current >= max) return 'high';
    return 'normal';
  };

  const getProductInventory = (product) => {
    const stockData = stockByProductId[product.id] || {};
    const current = toNumber(stockData.current ?? product.stock);
    const min = toNumber(stockData.min ?? product.minStock);
    const max = toNumber(stockData.max ?? product.maxStock);
    return { current, min, max };
  };

  const filteredProducts = products.filter(product => {
    const inventory = getProductInventory(product);
    const productName = product.name || '';
    const productSku = product.sku || product.productCode || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productSku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (stockFilter === 'low') {
      return matchesSearch && inventory.current <= inventory.min;
    }
    if (stockFilter === 'out') {
      return matchesSearch && inventory.current === 0;
    }
    
    return matchesSearch;
  });

  const lowStockCount = products.filter((product) => {
    const inventory = getProductInventory(product);
    return inventory.current <= inventory.min;
  }).length;

  const outOfStockCount = products.filter((product) => {
    const inventory = getProductInventory(product);
    return inventory.current === 0;
  }).length;

  const totalStockValue = products.reduce((sum, product) => {
    const inventory = getProductInventory(product);
    const unitCost = toNumber(product.cost ?? product.costPrice);
    return sum + (inventory.current * unitCost);
  }, 0);

  return (
    <div className="inventory-control">
      <div className="page-header">
        <h1>Control de Inventario</h1>
        <div className="page-actions">
          <button className="btn-primary">
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="inventory-stats">
        <div className="stat-card">
          <Package size={24} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Total Productos</span>
            <h3 className="stat-value">{products.length}</h3>
          </div>
        </div>
        <div className="stat-card warning">
          <AlertTriangle size={24} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Stock Bajo</span>
            <h3 className="stat-value">{lowStockCount}</h3>
          </div>
        </div>
        <div className="stat-card danger">
          <Package size={24} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Sin Stock</span>
            <h3 className="stat-value">{outOfStockCount}</h3>
          </div>
        </div>
        <div className="stat-card">
          <Package size={24} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">Valor Total</span>
            <h3 className="stat-value">{formatCurrency(totalStockValue)}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos los productos</option>
          <option value="low">Stock bajo</option>
          <option value="out">Sin stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="table-empty">
            <Package size={48} />
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="text-right">Stock</th>
                <th className="text-right">Stock Mín.</th>
                <th className="text-right">Costo Unit.</th>
                <th className="text-right">Precio</th>
                <th className="text-right">Valor Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const inventory = getProductInventory(product);
                const unitCost = toNumber(product.cost ?? product.costPrice);
                const unitPrice = toNumber(product.price ?? product.salePrice);
                const stockStatus = getStockStatus(inventory.current, inventory.min, inventory.max);
                const stockValue = inventory.current * unitCost;
                
                return (
                  <tr key={product.id}>
                    <td className="product-sku">{product.sku || product.productCode || '-'}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category || product.categoryId || '-'}</td>
                    <td className="text-right">
                      <span className={`stock-value stock-${stockStatus}`}>
                        {formatNumber(inventory.current, 0)}
                      </span>
                    </td>
                    <td className="text-right">{formatNumber(inventory.min, 0)}</td>
                    <td className="text-right">{formatCurrency(unitCost)}</td>
                    <td className="text-right">{formatCurrency(unitPrice)}</td>
                    <td className="text-right">{formatCurrency(stockValue)}</td>
                    <td>
                      <span className={`status-badge stock-${stockStatus}`}>
                        {stockStatus === 'low' && 'Stock Bajo'}
                        {stockStatus === 'normal' && 'Normal'}
                        {stockStatus === 'high' && 'Exceso'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon">Ver</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryControl;
