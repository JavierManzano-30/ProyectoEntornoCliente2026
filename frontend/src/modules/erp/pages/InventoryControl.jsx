import { useEffect, useState } from 'react';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { useInventory } from '../hooks';
import { formatCurrency, formatNumber } from '../utils';
import './InventoryControl.css';

/**
 * Página de Control de Inventario
 * Gestión de productos y stock
 */
const InventoryControl = () => {
  const { products, loading, loadProducts, loadStockLevels } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    loadProducts();
    loadStockLevels();
  }, [loadProducts, loadStockLevels]);

  const getStockStatus = (current, min, max) => {
    if (current <= min) return 'low';
    if (current >= max) return 'high';
    return 'normal';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (stockFilter === 'low') {
      return matchesSearch && product.stock <= product.minStock;
    }
    if (stockFilter === 'out') {
      return matchesSearch && product.stock === 0;
    }
    
    return matchesSearch;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

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
            <h3 className="stat-value">{formatCurrency(320000)}</h3>
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
                const stockStatus = getStockStatus(product.stock, product.minStock, product.maxStock);
                const stockValue = (product.stock || 0) * (product.cost || 0);
                
                return (
                  <tr key={product.id}>
                    <td className="product-sku">{product.sku || '-'}</td>
                    <td className="product-name">{product.name}</td>
                    <td>{product.category || '-'}</td>
                    <td className="text-right">
                      <span className={`stock-value stock-${stockStatus}`}>
                        {formatNumber(product.stock || 0, 0)}
                      </span>
                    </td>
                    <td className="text-right">{formatNumber(product.minStock || 0, 0)}</td>
                    <td className="text-right">{formatCurrency(product.cost || 0)}</td>
                    <td className="text-right">{formatCurrency(product.price || 0)}</td>
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
