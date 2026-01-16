# Módulo ERP Frontend - Estructura y Código (React)

## 📁 Estructura de Carpetas Completa

```
src/
└── modules/
    └── erp/
        ├── components/                      # Componentes específicos del módulo
        │   ├── accounting/
        │   │   ├── AccountPicker.jsx
        │   │   ├── JournalEntryLines.jsx
        │   │   ├── BalanceCard.jsx
        │   │   ├── PeriodSelector.jsx
        │   │   ├── AccountingStats.jsx
        │   │   ├── TrialBalance.jsx
        │   │   └── ClosingPeriodForm.jsx
        │   │
        │   ├── purchasing/
        │   │   ├── SupplierCard.jsx
        │   │   ├── SupplierPicker.jsx
        │   │   ├── PurchaseOrderTable.jsx
        │   │   ├── PurchaseOrderForm.jsx
        │   │   ├── ReceiptForm.jsx
        │   │   ├── SupplierInvoiceCard.jsx
        │   │   ├── ThreeWayMatch.jsx
        │   │   └── PurchaseFilters.jsx
        │   │
        │   ├── sales/
        │   │   ├── CustomerCard.jsx
        │   │   ├── CustomerPicker.jsx
        │   │   ├── SalesOrderForm.jsx
        │   │   ├── InvoiceTable.jsx
        │   │   ├── InvoiceForm.jsx
        │   │   ├── PaymentForm.jsx
        │   │   ├── ReceivablesAging.jsx
        │   │   ├── CreditNoteForm.jsx
        │   │   └── SalesFilters.jsx
        │   │
        │   ├── inventory/
        │   │   ├── ItemCard.jsx
        │   │   ├── ItemPicker.jsx
        │   │   ├── WarehouseSelector.jsx
        │   │   ├── StockLevelIndicator.jsx
        │   │   ├── StockMovementTable.jsx
        │   │   ├── TransferForm.jsx
        │   │   ├── PhysicalCountForm.jsx
        │   │   ├── LotSerialPicker.jsx
        │   │   ├── StockValuation.jsx
        │   │   └── InventoryFilters.jsx
        │   │
        │   ├── production/
        │   │   ├── WorkOrderCard.jsx
        │   │   ├── BOMViewer.jsx
        │   │   ├── RouteSteps.jsx
        │   │   ├── WorkOrderProgress.jsx
        │   │   ├── MaterialConsumption.jsx
        │   │   ├── ProgressForm.jsx
        │   │   ├── CostAnalysis.jsx
        │   │   └── ProductionFilters.jsx
        │   │
        │   ├── projects/
        │   │   ├── ProjectCard.jsx
        │   │   ├── ProjectDashboard.jsx
        │   │   ├── BudgetVsActual.jsx
        │   │   ├── CostAllocationForm.jsx
        │   │   ├── ProfitabilityChart.jsx
        │   │   ├── MilestoneTimeline.jsx
        │   │   └── ProjectFilters.jsx
        │   │
        │   ├── treasury/
        │   │   ├── BankAccountCard.jsx
        │   │   ├── CashFlowChart.jsx
        │   │   ├── ReconciliationTable.jsx
        │   │   ├── PaymentAuthForm.jsx
        │   │   ├── ForecastViewer.jsx
        │   │   └── TreasuryFilters.jsx
        │   │
        │   └── common/
        │       ├── DocumentStatusBadge.jsx
        │       ├── AmountInput.jsx
        │       ├── TaxCalculator.jsx
        │       ├── PaymentTermsSelector.jsx
        │       ├── CurrencySelector.jsx
        │       └── ERPHeader.jsx
        │
        ├── pages/                           # Páginas principales del módulo
        │   ├── accounting/
        │   │   ├── AccountingList.jsx
        │   │   ├── JournalEntryForm.jsx
        │   │   ├── JournalEntryDetail.jsx
        │   │   ├── FinancialReports.jsx
        │   │   ├── AccountingSettings.jsx
        │   │   └── ClosingPeriods.jsx
        │   │
        │   ├── purchasing/
        │   │   ├── SupplierList.jsx
        │   │   ├── SupplierDetail.jsx
        │   │   ├── SupplierForm.jsx
        │   │   ├── PurchaseOrderList.jsx
        │   │   ├── PurchaseOrderForm.jsx
        │   │   ├── PurchaseOrderDetail.jsx
        │   │   ├── ReceiptList.jsx
        │   │   └── SupplierInvoiceList.jsx
        │   │
        │   ├── sales/
        │   │   ├── CustomerList.jsx
        │   │   ├── CustomerDetail.jsx
        │   │   ├── CustomerForm.jsx
        │   │   ├── SalesOrderList.jsx
        │   │   ├── SalesOrderForm.jsx
        │   │   ├── InvoiceList.jsx
        │   │   ├── InvoiceForm.jsx
        │   │   ├── InvoiceDetail.jsx
        │   │   └── ReceivablesReport.jsx
        │   │
        │   ├── inventory/
        │   │   ├── InventoryList.jsx
        │   │   ├── ItemDetail.jsx
        │   │   ├── ItemForm.jsx
        │   │   ├── StockLevels.jsx
        │   │   ├── StockMovementsList.jsx
        │   │   ├── TransferList.jsx
        │   │   ├── PhysicalCountList.jsx
        │   │   └── InventoryValuation.jsx
        │   │
        │   ├── production/
        │   │   ├── ProductionOrderList.jsx
        │   │   ├── ProductionOrderForm.jsx
        │   │   ├── ProductionOrderDetail.jsx
        │   │   ├── BOMManagement.jsx
        │   │   ├── RouteManagement.jsx
        │   │   └── ProductionReports.jsx
        │   │
        │   ├── projects/
        │   │   ├── ProjectList.jsx
        │   │   ├── ProjectDetail.jsx
        │   │   ├── ProjectForm.jsx
        │   │   ├── CostAllocation.jsx
        │   │   └── ProjectProfitability.jsx
        │   │
        │   ├── treasury/
        │   │   ├── BankAccountList.jsx
        │   │   ├── CashFlowForecast.jsx
        │   │   ├── BankReconciliation.jsx
        │   │   ├── PaymentAuthorization.jsx
        │   │   └── TreasuryDashboard.jsx
        │   │
        │   └── ERPDashboard.jsx              # Dashboard principal
        │
        ├── hooks/                           # Custom hooks del módulo
        │   ├── accounting/
        │   │   ├── useAccounts.js
        │   │   ├── useJournalEntries.js
        │   │   ├── useBalanceSheet.js
        │   │   └── useProfitLoss.js
        │   │
        │   ├── purchasing/
        │   │   ├── useSuppliers.js
        │   │   ├── usePurchaseOrders.js
        │   │   ├── useReceipts.js
        │   │   └── useSupplierInvoices.js
        │   │
        │   ├── sales/
        │   │   ├── useCustomers.js
        │   │   ├── useSalesOrders.js
        │   │   ├── useInvoices.js
        │   │   ├── usePayments.js
        │   │   └── useReceivables.js
        │   │
        │   ├── inventory/
        │   │   ├── useItems.js
        │   │   ├── useStockLevels.js
        │   │   ├── useStockMovements.js
        │   │   ├── useTransfers.js
        │   │   └── usePhysicalCounts.js
        │   │
        │   ├── production/
        │   │   ├── useWorkOrders.js
        │   │   ├── useBOMs.js
        │   │   ├── useRoutes.js
        │   │   └── useProductionCosts.js
        │   │
        │   ├── projects/
        │   │   ├── useProjects.js
        │   │   ├── useCostAllocations.js
        │   │   └── useProfitability.js
        │   │
        │   └── treasury/
        │       ├── useBankAccounts.js
        │       ├── useCashFlow.js
        │       ├── useReconciliations.js
        │       └── usePaymentAuth.js
        │
        ├── context/                         # Contexto específico del módulo
        │   ├── ERPContext.jsx
        │   └── ERPProvider.jsx
        │
        ├── services/                        # Servicios de comunicación con API
        │   ├── accountingService.js
        │   ├── purchasingService.js
        │   ├── salesService.js
        │   ├── inventoryService.js
        │   ├── productionService.js
        │   ├── projectService.js
        │   └── treasuryService.js
        │
        ├── utils/                           # Utilidades específicas del módulo
        │   ├── accountingHelpers.js
        │   ├── balanceValidators.js
        │   ├── taxCalculations.js
        │   ├── inventoryCalculations.js
        │   ├── costingHelpers.js
        │   ├── currencyFormatters.js
        │   ├── dateHelpers.js
        │   └── reportGenerators.js
        │
        ├── constants/                       # Constantes del módulo
        │   ├── accountTypes.js
        │   ├── documentTypes.js
        │   ├── documentStatuses.js
        │   ├── paymentTerms.js
        │   ├── taxTypes.js
        │   ├── stockMovementTypes.js
        │   ├── productionStatuses.js
        │   └── currencies.js
        │
        ├── styles/                          # Estilos específicos del módulo
        │   ├── erp.module.css
        │   ├── accounting.module.css
        │   ├── purchasing.module.css
        │   ├── sales.module.css
        │   ├── inventory.module.css
        │   ├── production.module.css
        │   ├── projects.module.css
        │   └── treasury.module.css
        │
        └── __tests__/                       # Tests del módulo
            ├── pages/
            │   ├── AccountingList.test.jsx
            │   ├── PurchaseOrderForm.test.jsx
            │   └── InvoiceList.test.jsx
            ├── components/
            │   ├── JournalEntryLines.test.jsx
            │   ├── BalanceCard.test.jsx
            │   └── StockLevelIndicator.test.jsx
            ├── hooks/
            │   ├── useJournalEntries.test.js
            │   ├── usePurchaseOrders.test.js
            │   └── useInvoices.test.js
            └── services/
                ├── accountingService.test.js
                └── inventoryService.test.js
```

---

## 📄 Ejemplos de Código de Componentes

### 1. Página: Listado de Asientos Contables

```jsx
// pages/accounting/AccountingList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournalEntries } from '../../hooks/accounting/useJournalEntries';
import JournalEntryTable from '../../components/accounting/JournalEntryTable';
import AccountingStats from '../../components/accounting/AccountingStats';
import PeriodSelector from '../../components/accounting/PeriodSelector';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import PageHeader from '@/components/common/PageHeader';
import styles from '../../styles/accounting.module.css';

const AccountingList = () => {
  const navigate = useNavigate();
  const {
    journalEntries,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    handleSearch,
    handlePageChange,
    handlePeriodChange,
    refetch
  } = useJournalEntries();

  const handleCreateEntry = () => {
    navigate('/erp/contabilidad/nuevo');
  };

  const handleViewEntry = (id) => {
    navigate(`/erp/contabilidad/${id}`);
  };

  const handleEditEntry = (id) => {
    navigate(`/erp/contabilidad/${id}/editar`);
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={styles.accountingListContainer}>
      <PageHeader
        title="Contabilidad General"
        subtitle="Gestión de asientos y plan contable"
        actions={
          <Button 
            variant="primary" 
            onClick={handleCreateEntry}
            icon="plus"
          >
            Nuevo Asiento
          </Button>
        }
      />

      <AccountingStats data={journalEntries} />

      <div className={styles.filtersSection}>
        <PeriodSelector 
          value={filters.period}
          onChange={handlePeriodChange}
          className={styles.periodSelector}
        />
        <SearchBar 
          placeholder="Buscar por número, concepto o cuenta..."
          onSearch={handleSearch}
          className={styles.searchBar}
        />
      </div>

      <JournalEntryTable 
        data={journalEntries}
        onView={handleViewEntry}
        onEdit={handleEditEntry}
      />

      <Pagination 
        current={pagination.page}
        total={pagination.totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default AccountingList;
```

---

### 2. Componente: Líneas de Asiento Contable

```jsx
// components/accounting/JournalEntryLines.jsx
import React, { useState, useEffect } from 'react';
import AccountPicker from './AccountPicker';
import AmountInput from '../common/AmountInput';
import Button from '@/components/common/Button';
import { formatCurrency } from '../../utils/currencyFormatters';
import styles from '../../styles/accounting.module.css';

const JournalEntryLines = ({ lines, onChange, readonly = false }) => {
  const [localLines, setLocalLines] = useState(lines || []);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });

  useEffect(() => {
    calculateTotals();
  }, [localLines]);

  const calculateTotals = () => {
    const debit = localLines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const credit = localLines.reduce((sum, line) => sum + (line.credit || 0), 0);
    setTotals({ debit, credit });
  };

  const handleAddLine = () => {
    const newLine = {
      id: Date.now(),
      account: null,
      description: '',
      debit: 0,
      credit: 0
    };
    const updatedLines = [...localLines, newLine];
    setLocalLines(updatedLines);
    onChange?.(updatedLines);
  };

  const handleRemoveLine = (id) => {
    const updatedLines = localLines.filter(line => line.id !== id);
    setLocalLines(updatedLines);
    onChange?.(updatedLines);
  };

  const handleLineChange = (id, field, value) => {
    const updatedLines = localLines.map(line => {
      if (line.id === id) {
        // Si se modifica debit, credit debe ser 0 y viceversa
        if (field === 'debit' && value > 0) {
          return { ...line, debit: value, credit: 0 };
        }
        if (field === 'credit' && value > 0) {
          return { ...line, credit: value, debit: 0 };
        }
        return { ...line, [field]: value };
      }
      return line;
    });
    setLocalLines(updatedLines);
    onChange?.(updatedLines);
  };

  const isBalanced = totals.debit === totals.credit && totals.debit > 0;

  return (
    <div className={styles.journalEntryLines}>
      <div className={styles.linesHeader}>
        <h3>Líneas del Asiento</h3>
        {!readonly && (
          <Button onClick={handleAddLine} size="small" variant="secondary">
            + Agregar Línea
          </Button>
        )}
      </div>

      <table className={styles.linesTable}>
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Descripción</th>
            <th className={styles.amountColumn}>Debe</th>
            <th className={styles.amountColumn}>Haber</th>
            {!readonly && <th className={styles.actionsColumn}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {localLines.map((line) => (
            <tr key={line.id}>
              <td>
                <AccountPicker
                  value={line.account}
                  onChange={(account) => handleLineChange(line.id, 'account', account)}
                  disabled={readonly}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={line.description}
                  onChange={(e) => handleLineChange(line.id, 'description', e.target.value)}
                  placeholder="Descripción..."
                  disabled={readonly}
                  className={styles.descriptionInput}
                />
              </td>
              <td>
                <AmountInput
                  value={line.debit}
                  onChange={(value) => handleLineChange(line.id, 'debit', value)}
                  disabled={readonly || line.credit > 0}
                />
              </td>
              <td>
                <AmountInput
                  value={line.credit}
                  onChange={(value) => handleLineChange(line.id, 'credit', value)}
                  disabled={readonly || line.debit > 0}
                />
              </td>
              {!readonly && (
                <td>
                  <Button
                    variant="danger"
                    size="small"
                    icon="trash"
                    onClick={() => handleRemoveLine(line.id)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.totalsRow}>
            <td colSpan="2"><strong>Totales</strong></td>
            <td className={`${styles.amountColumn} ${styles.debitTotal}`}>
              {formatCurrency(totals.debit)}
            </td>
            <td className={`${styles.amountColumn} ${styles.creditTotal}`}>
              {formatCurrency(totals.credit)}
            </td>
            {!readonly && <td></td>}
          </tr>
        </tfoot>
      </table>

      <div className={styles.balanceIndicator}>
        {isBalanced ? (
          <span className={styles.balanced}>✓ Asiento Balanceado</span>
        ) : (
          <span className={styles.unbalanced}>
            ✗ Diferencia: {formatCurrency(Math.abs(totals.debit - totals.credit))}
          </span>
        )}
      </div>
    </div>
  );
};

export default JournalEntryLines;
```

---

### 3. Página: Órdenes de Compra

```jsx
// pages/purchasing/PurchaseOrderList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePurchaseOrders } from '../../hooks/purchasing/usePurchaseOrders';
import PurchaseOrderTable from '../../components/purchasing/PurchaseOrderTable';
import PurchaseFilters from '../../components/purchasing/PurchaseFilters';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import PageHeader from '@/components/common/PageHeader';
import { PURCHASE_ORDER_STATUSES } from '../../constants/documentStatuses';
import styles from '../../styles/purchasing.module.css';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const {
    purchaseOrders,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    handleSearch,
    handlePageChange,
    handleStatusChange,
    refetch
  } = usePurchaseOrders();

  const handleCreateOrder = () => {
    navigate('/erp/compras/ordenes/nueva');
  };

  const handleViewOrder = (id) => {
    navigate(`/erp/compras/ordenes/${id}`);
  };

  const handleEditOrder = (id) => {
    navigate(`/erp/compras/ordenes/${id}/editar`);
  };

  const handleReceiveOrder = (id) => {
    navigate(`/erp/compras/ordenes/${id}/recibir`);
  };

  const getStatusStats = () => {
    const stats = {};
    PURCHASE_ORDER_STATUSES.forEach(status => {
      stats[status.value] = purchaseOrders.filter(po => po.status === status.value).length;
    });
    return stats;
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={styles.purchaseOrderListContainer}>
      <PageHeader
        title="Órdenes de Compra"
        subtitle="Gestión del proceso de aprovisionamiento"
        actions={
          <Button 
            variant="primary" 
            onClick={handleCreateOrder}
            icon="plus"
          >
            Nueva Orden de Compra
          </Button>
        }
      />

      <div className={styles.statsBar}>
        {PURCHASE_ORDER_STATUSES.map(status => (
          <div key={status.value} className={styles.statCard}>
            <span className={styles.statLabel}>{status.label}</span>
            <span className={`${styles.statValue} ${styles[status.value]}`}>
              {getStatusStats()[status.value] || 0}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.filtersSection}>
        <SearchBar 
          placeholder="Buscar por número, proveedor o artículo..."
          onSearch={handleSearch}
          className={styles.searchBar}
        />
        <PurchaseFilters 
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      <PurchaseOrderTable 
        data={purchaseOrders}
        onView={handleViewOrder}
        onEdit={handleEditOrder}
        onReceive={handleReceiveOrder}
      />

      <Pagination 
        current={pagination.page}
        total={pagination.totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default PurchaseOrderList;
```

---

### 4. Componente: Indicador de Nivel de Stock

```jsx
// components/inventory/StockLevelIndicator.jsx
import React from 'react';
import { formatNumber } from '../../utils/currencyFormatters';
import styles from '../../styles/inventory.module.css';

const StockLevelIndicator = ({ 
  current, 
  minimum, 
  maximum, 
  reorderPoint,
  unit = 'UNI',
  showDetails = true 
}) => {
  const getStockStatus = () => {
    if (current <= 0) return 'outOfStock';
    if (current < minimum) return 'critical';
    if (current <= reorderPoint) return 'warning';
    if (current >= maximum) return 'excess';
    return 'optimal';
  };

  const getStockPercentage = () => {
    if (maximum === 0) return 0;
    return Math.min((current / maximum) * 100, 100);
  };

  const getStatusConfig = () => {
    const configs = {
      outOfStock: {
        label: 'Sin Stock',
        color: '#ef4444',
        icon: '✗'
      },
      critical: {
        label: 'Stock Crítico',
        color: '#dc2626',
        icon: '⚠'
      },
      warning: {
        label: 'Bajo Mínimo',
        color: '#f59e0b',
        icon: '⚠'
      },
      optimal: {
        label: 'Stock Óptimo',
        color: '#10b981',
        icon: '✓'
      },
      excess: {
        label: 'Sobre Stock',
        color: '#6366f1',
        icon: '↑'
      }
    };
    return configs[getStockStatus()];
  };

  const status = getStockStatus();
  const percentage = getStockPercentage();
  const config = getStatusConfig();

  return (
    <div className={styles.stockLevelIndicator}>
      <div className={styles.stockHeader}>
        <span className={styles.currentStock}>
          {formatNumber(current)} {unit}
        </span>
        <span 
          className={styles.statusBadge}
          style={{ backgroundColor: config.color }}
        >
          {config.icon} {config.label}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: config.color 
          }}
        />
        {reorderPoint && (
          <div 
            className={styles.reorderMarker}
            style={{ left: `${(reorderPoint / maximum) * 100}%` }}
            title={`Punto de reorden: ${reorderPoint} ${unit}`}
          />
        )}
      </div>

      {showDetails && (
        <div className={styles.stockDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Mínimo:</span>
            <span className={styles.detailValue}>{formatNumber(minimum)} {unit}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Punto Reorden:</span>
            <span className={styles.detailValue}>{formatNumber(reorderPoint)} {unit}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Máximo:</span>
            <span className={styles.detailValue}>{formatNumber(maximum)} {unit}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockLevelIndicator;
```

---

### 5. Hook Personalizado: Gestión de Órdenes de Trabajo

```javascript
// hooks/production/useWorkOrders.js
import { useState, useEffect, useCallback } from 'react';
import { productionService } from '../../services/productionService';
import { useNotification } from '@/hooks/useNotification';

export const useWorkOrders = (filters = {}) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalPages: 0,
    totalItems: 0
  });

  const { showSuccess, showError } = useNotification();

  const fetchWorkOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productionService.getWorkOrders({
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      });

      setWorkOrders(response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalItems: response.totalItems
      }));
    } catch (err) {
      setError(err.message || 'Error al cargar órdenes de trabajo');
      showError('Error al cargar órdenes de trabajo');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const createWorkOrder = async (data) => {
    try {
      const newWorkOrder = await productionService.createWorkOrder(data);
      showSuccess('Orden de trabajo creada exitosamente');
      fetchWorkOrders();
      return newWorkOrder;
    } catch (err) {
      showError(err.message || 'Error al crear orden de trabajo');
      throw err;
    }
  };

  const updateWorkOrder = async (id, data) => {
    try {
      const updated = await productionService.updateWorkOrder(id, data);
      showSuccess('Orden de trabajo actualizada');
      fetchWorkOrders();
      return updated;
    } catch (err) {
      showError(err.message || 'Error al actualizar orden');
      throw err;
    }
  };

  const startWorkOrder = async (id) => {
    try {
      await productionService.startWorkOrder(id);
      showSuccess('Orden de trabajo iniciada');
      fetchWorkOrders();
    } catch (err) {
      showError(err.message || 'Error al iniciar orden');
      throw err;
    }
  };

  const registerProgress = async (id, progressData) => {
    try {
      await productionService.registerProgress(id, progressData);
      showSuccess('Avance registrado correctamente');
      fetchWorkOrders();
    } catch (err) {
      showError(err.message || 'Error al registrar avance');
      throw err;
    }
  };

  const consumeMaterials = async (id, materials) => {
    try {
      await productionService.consumeMaterials(id, materials);
      showSuccess('Consumo de materiales registrado');
      fetchWorkOrders();
    } catch (err) {
      showError(err.message || 'Error al registrar consumo');
      throw err;
    }
  };

  const completeWorkOrder = async (id) => {
    try {
      await productionService.completeWorkOrder(id);
      showSuccess('Orden de trabajo completada');
      fetchWorkOrders();
    } catch (err) {
      showError(err.message || 'Error al completar orden');
      throw err;
    }
  };

  const closeWorkOrder = async (id) => {
    try {
      await productionService.closeWorkOrder(id);
      showSuccess('Orden de trabajo cerrada');
      fetchWorkOrders();
    } catch (err) {
      showError(err.message || 'Error al cerrar orden');
      throw err;
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return {
    workOrders,
    loading,
    error,
    pagination,
    createWorkOrder,
    updateWorkOrder,
    startWorkOrder,
    registerProgress,
    consumeMaterials,
    completeWorkOrder,
    closeWorkOrder,
    handlePageChange,
    refetch: fetchWorkOrders
  };
};
```

---

### 6. Servicio: Gestión de Inventario

```javascript
// services/inventoryService.js
import apiClient from '@/services/apiClient';

const BASE_URL = '/api/v1/inventory';

export const inventoryService = {
  // Artículos
  getItems: async (params = {}) => {
    const response = await apiClient.get(`${BASE_URL}/items`, { params });
    return response.data;
  },

  getItem: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/items/${id}`);
    return response.data;
  },

  createItem: async (data) => {
    const response = await apiClient.post(`${BASE_URL}/items`, data);
    return response.data;
  },

  updateItem: async (id, data) => {
    const response = await apiClient.patch(`${BASE_URL}/items/${id}`, data);
    return response.data;
  },

  // Niveles de Stock
  getStockLevels: async (params = {}) => {
    const response = await apiClient.get(`${BASE_URL}/stock-levels`, { params });
    return response.data;
  },

  getStockByWarehouse: async (itemId, warehouseId) => {
    const response = await apiClient.get(
      `${BASE_URL}/items/${itemId}/warehouses/${warehouseId}/stock`
    );
    return response.data;
  },

  // Movimientos de Stock
  getStockMovements: async (params = {}) => {
    const response = await apiClient.get(`${BASE_URL}/stock-movements`, { params });
    return response.data;
  },

  createStockMovement: async (data) => {
    const response = await apiClient.post(`${BASE_URL}/stock-movements`, data);
    return response.data;
  },

  // Transferencias
  getTransfers: async (params = {}) => {
    const response = await apiClient.get(`${BASE_URL}/transfers`, { params });
    return response.data;
  },

  createTransfer: async (data) => {
    const response = await apiClient.post(`${BASE_URL}/transfers`, data);
    return response.data;
  },

  confirmTransfer: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/transfers/${id}/confirm`);
    return response.data;
  },

  // Conteos Físicos
  getPhysicalCounts: async (params = {}) => {
    const response = await apiClient.get(`${BASE_URL}/physical-counts`, { params });
    return response.data;
  },

  createPhysicalCount: async (data) => {
    const response = await apiClient.post(`${BASE_URL}/physical-counts`, data);
    return response.data;
  },

  processPhysicalCount: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/physical-counts/${id}/process`);
    return response.data;
  },

  // Ajustes de Inventario
  createAdjustment: async (data) => {
    const response = await apiClient.post(`${BASE_URL}/adjustments`, data);
    return response.data;
  },

  // Valoración
  getValuation: async (params = {}) => {
    const response = await apiClient.get(`${BASE_URL}/valuation`, { params });
    return response.data;
  },

  // Lotes y Series
  getLots: async (itemId) => {
    const response = await apiClient.get(`${BASE_URL}/items/${itemId}/lots`);
    return response.data;
  },

  getSerials: async (itemId) => {
    const response = await apiClient.get(`${BASE_URL}/items/${itemId}/serials`);
    return response.data;
  }
};

export default inventoryService;
```

---

### 7. Constantes: Estados de Documentos

```javascript
// constants/documentStatuses.js

export const PURCHASE_ORDER_STATUSES = [
  { value: 'draft', label: 'Borrador', color: '#94a3b8' },
  { value: 'sent', label: 'Enviada', color: '#3b82f6' },
  { value: 'partial', label: 'Parcial', color: '#f59e0b' },
  { value: 'completed', label: 'Completa', color: '#10b981' },
  { value: 'cancelled', label: 'Cancelada', color: '#ef4444' }
];

export const SALES_ORDER_STATUSES = [
  { value: 'draft', label: 'Borrador', color: '#94a3b8' },
  { value: 'confirmed', label: 'Confirmado', color: '#3b82f6' },
  { value: 'processing', label: 'En Proceso', color: '#f59e0b' },
  { value: 'shipped', label: 'Enviado', color: '#8b5cf6' },
  { value: 'delivered', label: 'Entregado', color: '#10b981' },
  { value: 'cancelled', label: 'Cancelado', color: '#ef4444' }
];

export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Borrador', color: '#94a3b8' },
  { value: 'issued', label: 'Emitida', color: '#3b82f6' },
  { value: 'sent', label: 'Enviada', color: '#6366f1' },
  { value: 'partial', label: 'Pago Parcial', color: '#f59e0b' },
  { value: 'paid', label: 'Pagada', color: '#10b981' },
  { value: 'overdue', label: 'Vencida', color: '#ef4444' },
  { value: 'cancelled', label: 'Anulada', color: '#64748b' }
];

export const JOURNAL_ENTRY_STATUSES = [
  { value: 'draft', label: 'Borrador', color: '#94a3b8' },
  { value: 'posted', label: 'Confirmado', color: '#10b981' },
  { value: 'closed', label: 'Cerrado', color: '#6366f1' }
];

export const WORK_ORDER_STATUSES = [
  { value: 'draft', label: 'Borrador', color: '#94a3b8' },
  { value: 'planned', label: 'Planificado', color: '#3b82f6' },
  { value: 'released', label: 'Liberado', color: '#6366f1' },
  { value: 'in_progress', label: 'En Proceso', color: '#f59e0b' },
  { value: 'completed', label: 'Completado', color: '#10b981' },
  { value: 'closed', label: 'Cerrado', color: '#64748b' },
  { value: 'cancelled', label: 'Cancelado', color: '#ef4444' }
];

export const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planificación', color: '#94a3b8' },
  { value: 'active', label: 'Activo', color: '#10b981' },
  { value: 'on_hold', label: 'En Espera', color: '#f59e0b' },
  { value: 'completed', label: 'Completado', color: '#6366f1' },
  { value: 'closed', label: 'Cerrado', color: '#64748b' },
  { value: 'cancelled', label: 'Cancelado', color: '#ef4444' }
];

export const STOCK_MOVEMENT_TYPES = [
  { value: 'receipt', label: 'Recepción', icon: 'arrow-down' },
  { value: 'issue', label: 'Salida', icon: 'arrow-up' },
  { value: 'transfer', label: 'Transferencia', icon: 'arrows-alt-h' },
  { value: 'adjustment', label: 'Ajuste', icon: 'edit' },
  { value: 'count', label: 'Conteo', icon: 'clipboard-check' },
  { value: 'production', label: 'Producción', icon: 'cog' },
  { value: 'return', label: 'Devolución', icon: 'undo' }
];
```

---

### 8. Utilidades: Cálculos Contables

```javascript
// utils/accountingHelpers.js

/**
 * Valida que un asiento esté balanceado
 */
export const validateJournalEntryBalance = (lines) => {
  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  
  return {
    isBalanced: totalDebit === totalCredit,
    debit: totalDebit,
    credit: totalCredit,
    difference: Math.abs(totalDebit - totalCredit)
  };
};

/**
 * Calcula el balance de una cuenta
 */
export const calculateAccountBalance = (accountType, debit, credit) => {
  const accountTypeMap = {
    'asset': debit - credit,
    'liability': credit - debit,
    'equity': credit - debit,
    'revenue': credit - debit,
    'expense': debit - credit
  };
  
  return accountTypeMap[accountType] || 0;
};

/**
 * Genera balance de comprobación
 */
export const generateTrialBalance = (journalEntries, accounts) => {
  const balances = {};
  
  // Inicializar cuentas
  accounts.forEach(account => {
    balances[account.code] = {
      account,
      debit: 0,
      credit: 0,
      balance: 0
    };
  });
  
  // Acumular movimientos
  journalEntries.forEach(entry => {
    if (entry.status === 'posted' || entry.status === 'closed') {
      entry.lines.forEach(line => {
        if (balances[line.accountCode]) {
          balances[line.accountCode].debit += line.debit || 0;
          balances[line.accountCode].credit += line.credit || 0;
        }
      });
    }
  });
  
  // Calcular balances
  Object.keys(balances).forEach(code => {
    const item = balances[code];
    item.balance = calculateAccountBalance(
      item.account.type,
      item.debit,
      item.credit
    );
  });
  
  return Object.values(balances);
};

/**
 * Genera balance de situación
 */
export const generateBalanceSheet = (trialBalance, period) => {
  const balanceSheet = {
    assets: { items: [], total: 0 },
    liabilities: { items: [], total: 0 },
    equity: { items: [], total: 0 }
  };
  
  trialBalance.forEach(item => {
    const { account, balance } = item;
    
    if (account.type === 'asset') {
      balanceSheet.assets.items.push({ account, balance });
      balanceSheet.assets.total += balance;
    } else if (account.type === 'liability') {
      balanceSheet.liabilities.items.push({ account, balance });
      balanceSheet.liabilities.total += balance;
    } else if (account.type === 'equity') {
      balanceSheet.equity.items.push({ account, balance });
      balanceSheet.equity.total += balance;
    }
  });
  
  return balanceSheet;
};

/**
 * Genera cuenta de resultados (P&L)
 */
export const generateProfitAndLoss = (trialBalance, period) => {
  const pnl = {
    revenue: { items: [], total: 0 },
    expenses: { items: [], total: 0 },
    netIncome: 0
  };
  
  trialBalance.forEach(item => {
    const { account, balance } = item;
    
    if (account.type === 'revenue') {
      pnl.revenue.items.push({ account, balance });
      pnl.revenue.total += balance;
    } else if (account.type === 'expense') {
      pnl.expenses.items.push({ account, balance });
      pnl.expenses.total += balance;
    }
  });
  
  pnl.netIncome = pnl.revenue.total - pnl.expenses.total;
  
  return pnl;
};

/**
 * Valida si un periodo está cerrado
 */
export const isPeriodClosed = (period, closedPeriods) => {
  return closedPeriods.some(
    cp => cp.year === period.year && cp.month === period.month
  );
};

/**
 * Formatea código de cuenta con guiones
 */
export const formatAccountCode = (code) => {
  // Ejemplo: 1010101 → 1-01-01-01
  if (!code) return '';
  const str = code.toString();
  return str.match(/.{1,2}/g)?.join('-') || str;
};
```

---

## 🧩 Integración con otros Módulos

### Integración con RRHH

```javascript
// Consumir datos de empleados para imputación de costes
import { rrhhService } from '@/modules/rrhh/services/rrhhService';

const allocateLaborCosts = async (projectId, employeeId, hours) => {
  const employee = await rrhhService.getEmployee(employeeId);
  const hourlyRate = employee.hourlyRate;
  
  const costAllocation = {
    projectId,
    employeeId,
    hours,
    rate: hourlyRate,
    total: hours * hourlyRate
  };
  
  await projectService.allocateCost(costAllocation);
};
```

### Integración con BPM

```javascript
// Disparar workflows de aprobación
import { bpmService } from '@/modules/bpm/services/bpmService';

const submitPurchaseOrderForApproval = async (purchaseOrderId) => {
  const workflow = await bpmService.startWorkflow({
    processKey: 'purchase-order-approval',
    businessKey: purchaseOrderId,
    variables: {
      amount: purchaseOrder.total,
      supplierId: purchaseOrder.supplierId
    }
  });
  
  return workflow;
};
```

### Integración con BI

```javascript
// Exponer métricas para dashboards
export const getERPMetrics = async (period) => {
  const [revenue, expenses, inventory] = await Promise.all([
    salesService.getRevenue(period),
    purchasingService.getExpenses(period),
    inventoryService.getValuation(period)
  ]);
  
  return {
    revenue,
    expenses,
    grossMargin: revenue - expenses,
    inventoryValue: inventory.total
  };
};
```

---

## 📋 Checklist de Implementación

- [ ] Estructura de carpetas creada
- [ ] Servicios de API implementados
- [ ] Custom hooks configurados
- [ ] Componentes base desarrollados
- [ ] Páginas principales implementadas
- [ ] Context Provider configurado
- [ ] Constantes definidas
- [ ] Utilidades implementadas
- [ ] Estilos aplicados
- [ ] Tests unitarios escritos
- [ ] Tests de integración completados
- [ ] Documentación actualizada
- [ ] Permisos configurados
- [ ] Integración con backend validada
- [ ] Integración con otros módulos probada
- [ ] Performance optimizada
- [ ] Responsive design verificado
