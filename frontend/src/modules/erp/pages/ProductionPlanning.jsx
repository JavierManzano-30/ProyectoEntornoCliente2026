import { useEffect, useMemo, useState } from 'react';
import erpService from '../services/erpService';
import { formatNumber, formatDate } from '../utils';
import './ERPSectionPages.css';

const movementLabel = {
  in: 'Entrada',
  out: 'Salida',
  transfer: 'Transferencia',
  adjustment: 'Ajuste',
  return: 'Devolucion'
};

const ProductionPlanning = () => {
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [movementsData, salesData, purchaseData] = await Promise.all([
          erpService.getInventoryMovements(),
          erpService.getSalesOrders(),
          erpService.getPurchaseOrders()
        ]);
        setMovements(Array.isArray(movementsData) ? movementsData : []);
        setSalesOrders(Array.isArray(salesData) ? salesData : []);
        setPurchaseOrders(Array.isArray(purchaseData) ? purchaseData : []);
      } catch (error) {
        console.error('Error cargando planificacion ERP:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const metrics = useMemo(() => {
    const inputQty = movements
      .filter((item) => String(item.movementType || '').toLowerCase() === 'in')
      .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const outputQty = movements
      .filter((item) => String(item.movementType || '').toLowerCase() === 'out')
      .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

    return {
      pendingSales: salesOrders.filter((item) => !['delivered', 'canceled'].includes(String(item.status || '').toLowerCase())).length,
      pendingPurchases: purchaseOrders.filter((item) => !['received', 'canceled'].includes(String(item.status || '').toLowerCase())).length,
      inputQty,
      outputQty
    };
  }, [movements, salesOrders, purchaseOrders]);

  const recentMovements = useMemo(
    () =>
      [...movements]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 12),
    [movements]
  );

  return (
    <div className="erp-section-page">
      <header className="erp-section-header">
        <div>
          <h1>Planificacion de Produccion</h1>
          <p>Seguimiento operativo basado en ordenes e inventario reales.</p>
        </div>
      </header>

      <section className="erp-section-grid">
        <article className="erp-section-card">
          <h3>Ordenes venta pendientes</h3>
          <strong>{metrics.pendingSales}</strong>
          <span>por entregar</span>
        </article>
        <article className="erp-section-card">
          <h3>Ordenes compra pendientes</h3>
          <strong>{metrics.pendingPurchases}</strong>
          <span>por recibir</span>
        </article>
        <article className="erp-section-card">
          <h3>Entradas inventario</h3>
          <strong>{formatNumber(metrics.inputQty, 0)}</strong>
          <span>unidades registradas</span>
        </article>
        <article className="erp-section-card">
          <h3>Salidas inventario</h3>
          <strong>{formatNumber(metrics.outputQty, 0)}</strong>
          <span>unidades consumidas</span>
        </article>
      </section>

      <section className="erp-section-panel">
        <h2>Ultimos Movimientos</h2>
        {loading ? (
          <div className="erp-section-loading">
            <div className="erp-section-spinner" />
            <p>Cargando produccion...</p>
          </div>
        ) : recentMovements.length === 0 ? (
          <div className="erp-section-empty">
            <p>No hay movimientos de inventario para mostrar.</p>
          </div>
        ) : (
          <table className="erp-section-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Producto</th>
                <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>{formatDate(movement.createdAt)}</td>
                  <td>{movementLabel[movement.movementType] || movement.movementType || '-'}</td>
                  <td>{formatNumber(Number(movement.quantity) || 0, 0)}</td>
                  <td>{movement.productId || '-'}</td>
                  <td>{movement.referenceType || movement.referenceId || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default ProductionPlanning;
