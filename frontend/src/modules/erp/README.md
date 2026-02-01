# Módulo ERP - Enterprise Resource Planning

Sistema integral de gestión empresarial que centraliza la información económica, logística y operativa de la organización.

## 📋 Descripción

El módulo ERP integra 8 áreas funcionales críticas para la gestión empresarial:

1. **Contabilidad General** - Plan contable, asientos, cierres y consolidación
2. **Compras** - Proveedores, órdenes de compra y recepciones
3. **Ventas** - Facturación, cuentas por cobrar y gestión de clientes
4. **Inventario** - Control de stock, almacenes y valoración
5. **Producción** - Órdenes de trabajo, BOMs y rutas
6. **Proyectos** - Centros de coste y análisis de rentabilidad
7. **Tesorería** - Bancos, conciliaciones y previsión de flujo
8. **Reporting** - Estados financieros y cumplimiento regulatorio

## 🏗️ Arquitectura

```
erp/
├── constants/           # Estados, tipos y configuraciones
│   ├── accountingStatus.js
│   ├── invoiceStatus.js
│   ├── inventoryStatus.js
│   ├── productionStatus.js
│   ├── paymentMethods.js
│   └── taxTypes.js
├── services/           # API y lógica de negocio
│   └── erpService.js   # 70+ endpoints API
├── context/            # Estado global
│   ├── ERPContext.js
│   └── ERPProvider.jsx
├── hooks/              # Custom hooks por área
│   ├── useAccounting.js
│   ├── usePurchases.js
│   ├── useSales.js
│   ├── useInventory.js
│   ├── useProduction.js
│   ├── useProjects.js
│   ├── useTreasury.js
│   └── useReporting.js
├── utils/              # Helpers y validadores
│   ├── accountingHelpers.js
│   ├── invoiceHelpers.js
│   ├── inventoryHelpers.js
│   ├── productionCalculations.js
│   ├── financialValidators.js
│   └── formatters.js
├── pages/              # Páginas principales
│   ├── ERPDashboard.jsx
│   ├── AccountingGeneral.jsx
│   ├── PurchaseManagement.jsx
│   ├── SalesInvoicing.jsx
│   ├── InventoryControl.jsx
│   ├── ProductionPlanning.jsx
│   ├── ProjectCosting.jsx
│   ├── TreasuryManagement.jsx
│   └── FinancialReporting.jsx
└── components/         # Componentes reutilizables
    ├── shared/
    ├── accounting/
    ├── purchases/
    ├── sales/
    ├── inventory/
    ├── production/
    ├── projects/
    └── treasury/
```

## 🚀 Características Principales

### Contabilidad General
- Plan contable jerárquico configurable
- Asientos contables con validación de balance
- Libro mayor y balance de comprobación
- Cierres contables mensuales/anuales
- Consolidación multiempresa

### Compras y Proveedores
- Gestión de proveedores y categorización
- Órdenes de compra con flujo de aprobación
- Recepción de mercancía (3-way match)
- Control de cuentas por pagar
- Análisis de rendimiento de proveedores

### Ventas y Facturación
- Facturación electrónica
- Gestión de cuentas por cobrar
- Reporte de antigüedad de saldos
- Notas de crédito/débito
- Integración con CRM

### Control de Inventario
- Múltiples almacenes y ubicaciones
- Lotes y números de serie
- Movimientos de inventario automatizados
- Conteos cíclicos
- Valoración por FIFO/LIFO/Promedio Ponderado

### Planificación de Producción
- Órdenes de trabajo y seguimiento
- Bill of Materials (BOM) multinivel
- Rutas de fabricación
- Control de costes de producción
- Análisis de varianzas

### Gestión de Proyectos
- Centros de coste y proyectos
- Presupuesto vs. real
- Imputación de tiempos y materiales
- Análisis de rentabilidad por proyecto
- Integración con ALM

### Tesorería
- Múltiples cuentas bancarias
- Conciliaciones automáticas
- Previsión de flujo de caja
- Gestión de pagos masivos
- Control de vencimientos

### Reporting Financiero
- Balance General
- Estado de Resultados (P&L)
- Flujo de Efectivo
- KPIs financieros en tiempo real
- Exportación a Excel/PDF

## 📊 Endpoints API

### Contabilidad (12 endpoints)
```javascript
- GET/POST /api/erp/accounting/chart-of-accounts
- GET/POST/PUT /api/erp/accounting/journal-entries
- POST /api/erp/accounting/journal-entries/:id/post
- POST /api/erp/accounting/journal-entries/:id/reverse
- GET /api/erp/accounting/reports/trial-balance
- GET /api/erp/accounting/reports/general-ledger
```

### Compras (10 endpoints)
```javascript
- GET/POST/PUT /api/erp/purchases/orders
- POST /api/erp/purchases/orders/:id/confirm
- POST /api/erp/purchases/goods-receipts
- GET/POST/PUT /api/erp/purchases/vendors
```

### Ventas (8 endpoints)
```javascript
- GET/POST/PUT /api/erp/sales/invoices
- POST /api/erp/sales/invoices/:id/send
- POST /api/erp/sales/invoices/:id/payments
- GET /api/erp/sales/receivables
- GET /api/erp/sales/reports/aging
```

### Inventario (10 endpoints)
```javascript
- GET/POST/PUT /api/erp/inventory/products
- GET /api/erp/inventory/stock
- GET/POST /api/erp/inventory/movements
- GET /api/erp/inventory/warehouses
- POST /api/erp/inventory/cycle-counts
- GET /api/erp/inventory/reports/valuation
```

### Producción (10 endpoints)
```javascript
- GET/POST/PUT /api/erp/production/orders
- POST /api/erp/production/orders/:id/release
- POST /api/erp/production/orders/:id/complete
- GET/POST /api/erp/production/boms
- GET /api/erp/production/routes
```

### Proyectos (7 endpoints)
```javascript
- GET/POST/PUT /api/erp/projects
- POST /api/erp/projects/allocations
- GET /api/erp/projects/:id/budget-comparison
- GET /api/erp/projects/:id/profitability
```

### Tesorería (9 endpoints)
```javascript
- GET/POST /api/erp/treasury/bank-accounts
- GET/POST /api/erp/treasury/movements
- GET/POST /api/erp/treasury/reconciliations
- GET /api/erp/treasury/reports/cash-flow-forecast
- GET /api/erp/treasury/reports/position
```

### Reporting (7 endpoints)
```javascript
- GET /api/erp/reports/balance-sheet
- GET /api/erp/reports/income-statement
- GET /api/erp/reports/cash-flow-statement
- GET /api/erp/reports/cost-analysis
- GET /api/erp/reports/financial-kpis
- GET /api/erp/reports/:type/export/pdf
- GET /api/erp/reports/:type/export/excel
```

**Total: 73 endpoints API**

## 🎨 Componentes Principales

### Dashboard
- **ERPDashboard**: Vista general con KPIs financieros
- Tarjetas de métricas (ingresos, gastos, beneficio, efectivo)
- Alertas de cuentas vencidas
- Gráficos de tendencias

### Páginas Funcionales
- **AccountingGeneral**: Gestión de plan contable y asientos
- **SalesInvoicing**: Facturación y cuentas por cobrar
- **InventoryControl**: Control de stock y productos
- **PurchaseManagement**: Órdenes de compra y proveedores
- **ProductionPlanning**: Órdenes de producción y BOMs
- **ProjectCosting**: Análisis de costos por proyecto
- **TreasuryManagement**: Bancos y flujo de caja
- **FinancialReporting**: Estados financieros

## 🔧 Hooks Personalizados

```javascript
// Ejemplo de uso del hook de contabilidad
import { useAccounting } from '@/modules/erp/hooks';

function MyComponent() {
  const { 
    journalEntries, 
    loading, 
    createEntry, 
    postEntry 
  } = useAccounting();

  // Cargar asientos
  useEffect(() => {
    loadJournalEntries({ period: '2026-01' });
  }, []);

  // Crear asiento
  const handleCreate = async () => {
    await createEntry({
      date: '2026-01-15',
      description: 'Asiento de apertura',
      lines: [
        { account: '1000', debit: 10000, credit: 0 },
        { account: '5000', debit: 0, credit: 10000 }
      ]
    });
  };
}
```

## 🧮 Utilidades y Helpers

### Formateo de Moneda
```javascript
import { formatCurrency } from '@/modules/erp/utils';

formatCurrency(1234.56, 'EUR'); // "1.234,56 €"
```

### Validación de Asientos
```javascript
import { isEntryBalanced, validateJournalEntry } from '@/modules/erp/utils';

const entry = {
  lines: [
    { debit: 1000, credit: 0 },
    { debit: 0, credit: 1000 }
  ]
};

isEntryBalanced(entry.lines); // true
```

### Cálculos de Inventario
```javascript
import { calculateInventoryTurnover, getStockLevel } from '@/modules/erp/utils';

const turnover = calculateInventoryTurnover(costOfGoodsSold, avgInventory);
const level = getStockLevel(currentStock, minStock, maxStock); // 'low' | 'normal' | 'high'
```

## 🔐 Validaciones Financieras

El módulo incluye validadores completos para:
- Montos y cantidades
- Fechas y rangos
- NIF/CIF (identificación fiscal española)
- IBAN
- Email y teléfono
- Códigos contables
- Líneas de factura
- Asientos contables
- Productos

## 📱 Rutas del Módulo

```javascript
/erp                    - Dashboard principal
/erp/contabilidad       - Contabilidad general
/erp/compras            - Gestión de compras
/erp/ventas             - Facturación y ventas
/erp/inventario         - Control de inventario
/erp/produccion         - Planificación de producción
/erp/proyectos          - Costos por proyecto
/erp/tesoreria          - Gestión de tesorería
/erp/reportes           - Reportes financieros
```

## 🌐 Integración con Otros Módulos

### CRM
- Sincronización de clientes
- Oportunidades → Pedidos → Facturas
- Historial de transacciones

### RRHH
- Costos de nómina → Contabilidad
- Imputación de horas → Proyectos/Producción
- Centro de costos por departamento

### ALM
- Proyectos ALM → Proyectos ERP
- Seguimiento de costos
- Facturación por proyecto

### BPM
- Flujos de aprobación de compras
- Workflow de facturación
- Procesos de cierre contable

### BI
- KPIs financieros en dashboards
- Reportes personalizados
- Análisis de rentabilidad

## 💾 Estructura de Datos

### Asiento Contable
```javascript
{
  id: 'JE-001',
  number: 'AS-2026-000001',
  date: '2026-01-15',
  description: 'Asiento de apertura',
  type: 'opening',
  status: 'posted',
  lines: [
    {
      account: '1000',
      accountName: 'Caja',
      debit: 10000,
      credit: 0,
      description: 'Apertura caja'
    }
  ],
  totalDebit: 10000,
  totalCredit: 10000
}
```

### Factura de Venta
```javascript
{
  id: 'INV-001',
  number: 'INV-26-000001',
  customerId: 'CUST-001',
  customerName: 'Cliente SA',
  date: '2026-01-20',
  dueDate: '2026-02-20',
  status: 'sent',
  lines: [
    {
      productId: 'PROD-001',
      description: 'Producto A',
      quantity: 10,
      unitPrice: 100,
      discount: 5,
      taxRate: 21,
      total: 1139.85
    }
  ],
  subtotal: 950,
  totalTax: 189.85,
  total: 1139.85,
  pending: 1139.85
}
```

### Producto
```javascript
{
  id: 'PROD-001',
  sku: 'PRD-000001',
  name: 'Producto A',
  category: 'Categoría 1',
  cost: 80,
  price: 100,
  stock: 150,
  minStock: 20,
  maxStock: 200,
  warehouse: 'ALM-01',
  valuationMethod: 'average'
}
```

## 🎯 Próximos Pasos

- [ ] Implementar componentes compartidos
- [ ] Tests unitarios para utilidades
- [ ] Tests E2E para flujos críticos
- [ ] Integración con backend real
- [ ] Añadir gráficos financieros (Chart.js)
- [ ] Módulo de impuestos avanzado
- [ ] Facturación electrónica (e-invoice)
- [ ] Multi-moneda y conversión automática
- [ ] Presupuestos y previsiones

## 📚 Documentación Adicional

Para más información, consulta:
- [Documentación Backend ERP](../../backend/docs/modulos/erp/)
- [API Reference](../../backend/docs/api/)
- [Guía de Usuario](./docs/user-guide.md)

## 🤝 Contribución

Este módulo sigue los mismos estándares que el resto de la aplicación. Ver [CONTRIBUTING.md](../../CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Parte del sistema ERP integrado - Propiedad del Grupo 2026
