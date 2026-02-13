import { useEffect, useState } from 'react';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { useInventory } from '../hooks';
import { formatCurrency, formatNumber } from '../utils';
import './InventoryControl.css';

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const emptyProductForm = () => ({
  name: '',
  sku: `SKU-${Date.now()}`,
  costPrice: '0',
  salePrice: '0'
});

const InventoryControl = () => {
  const {
    products,
    stockLevels,
    loading,
    loadProducts,
    loadStockLevels,
    createProduct,
    createMovement
  } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm());
  const [adjustmentProductId, setAdjustmentProductId] = useState('');
  const [adjustmentForm, setAdjustmentForm] = useState({
    movementType: 'in',
    quantity: '1',
    warehouseId: '',
    userId: localStorage.getItem('userId') || ''
  });

  const stockByProductId = stockLevels.reduce((acc, stock) => {
    const productId = stock.productId || stock.product_id;
    if (!productId) return acc;
    const previous = acc[productId] || { current: 0, min: 0, max: 0 };
    acc[productId] = {
      current: previous.current + toNumber(stock.quantityAvailable ?? stock.quantity_available),
      min: previous.min + toNumber(stock.minimumQuantity ?? stock.minimum_quantity),
      max: previous.max + toNumber(stock.maximumQuantity ?? stock.maximum_quantity),
      warehouseId: stock.warehouseId || stock.warehouse_id
    };
    return acc;
  }, {});

  const reload = async () => {
    await Promise.all([loadProducts(), loadStockLevels()]);
  };

  useEffect(() => {
    reload();
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
    const warehouseId = stockData.warehouseId || product.warehouseId || product.warehouse_id;
    return { current, min, max, warehouseId };
  };

  const filteredProducts = products.filter((product) => {
    const inventory = getProductInventory(product);
    const productName = product.name || '';
    const productSku = product.sku || product.productCode || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase())
      || productSku.toLowerCase().includes(searchTerm.toLowerCase());

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
    const unitCost = toNumber(product.cost ?? product.costPrice ?? product.cost_price);
    return sum + (inventory.current * unitCost);
  }, 0);

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    if (!productForm.name || !productForm.sku) {
      setErrorMessage('Nombre y SKU son obligatorios.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      await createProduct({
        name: productForm.name,
        sku: productForm.sku,
        costPrice: toNumber(productForm.costPrice),
        salePrice: toNumber(productForm.salePrice),
        status: 'active'
      });
      setProductForm(emptyProductForm());
      setShowProductForm(false);
      await reload();
    } catch (error) {
      setErrorMessage('No se pudo crear el producto.');
      console.error('Error creando producto ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustment = async (event) => {
    event.preventDefault();
    if (!adjustmentProductId || !adjustmentForm.warehouseId || !adjustmentForm.userId) {
      setErrorMessage('Producto, almacen y userId son obligatorios para el ajuste.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      await createMovement({
        productId: adjustmentProductId,
        warehouseId: adjustmentForm.warehouseId,
        movementType: adjustmentForm.movementType,
        quantity: Math.abs(toNumber(adjustmentForm.quantity)),
        userId: adjustmentForm.userId,
        description: 'Ajuste manual desde modulo ERP'
      });
      setAdjustmentProductId('');
      setAdjustmentForm((prev) => ({ ...prev, quantity: '1' }));
      await loadStockLevels();
    } catch (error) {
      setErrorMessage('No se pudo registrar el movimiento.');
      console.error('Error registrando movimiento ERP:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="inventory-control">
      <div className="page-header">
        <h1>Control de Inventario</h1>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => setShowProductForm((prev) => !prev)} disabled={saving}>
            <Plus size={20} />
            {showProductForm ? 'Cerrar formulario' : 'Nuevo Producto'}
          </button>
        </div>
      </div>

      {errorMessage && <p className="form-error">{errorMessage}</p>}
      {showProductForm && (
        <form className="filters-bar" onSubmit={handleCreateProduct}>
          <input
            className="filter-select"
            type="text"
            placeholder="Nombre"
            value={productForm.name}
            onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            className="filter-select"
            type="text"
            placeholder="SKU"
            value={productForm.sku}
            onChange={(event) => setProductForm((prev) => ({ ...prev, sku: event.target.value }))}
          />
          <input
            className="filter-select"
            type="number"
            step="0.01"
            placeholder="Coste"
            value={productForm.costPrice}
            onChange={(event) => setProductForm((prev) => ({ ...prev, costPrice: event.target.value }))}
          />
          <input
            className="filter-select"
            type="number"
            step="0.01"
            placeholder="Precio venta"
            value={productForm.salePrice}
            onChange={(event) => setProductForm((prev) => ({ ...prev, salePrice: event.target.value }))}
          />
          <button className="btn-primary" type="submit" disabled={saving}>
            Guardar producto
          </button>
        </form>
      )}

      <form className="filters-bar" onSubmit={handleAdjustment}>
        <select
          className="filter-select"
          value={adjustmentProductId}
          onChange={(event) => {
            const productId = event.target.value;
            setAdjustmentProductId(productId);
            const selectedProduct = products.find((product) => product.id === productId);
            if (selectedProduct) {
              const selectedInventory = getProductInventory(selectedProduct);
              setAdjustmentForm((prev) => ({
                ...prev,
                warehouseId: selectedInventory.warehouseId || prev.warehouseId
              }));
            }
          }}
        >
          <option value="">Producto para ajuste</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={adjustmentForm.movementType}
          onChange={(event) => setAdjustmentForm((prev) => ({ ...prev, movementType: event.target.value }))}
        >
          <option value="in">Entrada</option>
          <option value="out">Salida</option>
          <option value="adjustment">Ajuste</option>
        </select>
        <input
          className="filter-select"
          type="number"
          step="0.01"
          placeholder="Cantidad"
          value={adjustmentForm.quantity}
          onChange={(event) => setAdjustmentForm((prev) => ({ ...prev, quantity: event.target.value }))}
        />
        <input
          className="filter-select"
          type="text"
          placeholder="warehouseId"
          value={adjustmentForm.warehouseId}
          onChange={(event) => setAdjustmentForm((prev) => ({ ...prev, warehouseId: event.target.value }))}
        />
        <input
          className="filter-select"
          type="text"
          placeholder="userId"
          value={adjustmentForm.userId}
          onChange={(event) => setAdjustmentForm((prev) => ({ ...prev, userId: event.target.value }))}
        />
        <button className="btn-primary" type="submit" disabled={saving}>
          Registrar ajuste
        </button>
      </form>

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

      <div className="products-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner" />
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
                <th>Categoria</th>
                <th className="text-right">Stock</th>
                <th className="text-right">Stock Min.</th>
                <th className="text-right">Costo Unit.</th>
                <th className="text-right">Precio</th>
                <th className="text-right">Valor Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const inventory = getProductInventory(product);
                const unitCost = toNumber(product.cost ?? product.costPrice ?? product.cost_price);
                const unitPrice = toNumber(product.price ?? product.salePrice ?? product.sale_price);
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
                      <span className="erp-section-muted">Usa formulario</span>
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
