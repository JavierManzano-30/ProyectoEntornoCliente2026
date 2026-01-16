# Documentación Técnica - Módulo ERP Frontend

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **ERP (Enterprise Resource Planning)** del frontend es responsable de proporcionar una interfaz completa y eficiente para la gestión integral de los procesos económicos, financieros, logísticos y operativos de la empresa.

Este módulo actúa como **punto central de administración económico-financiera**, proporcionando herramientas tanto para el departamento financiero, contable, compras, ventas, logística y producción.

### Objetivos Principales

1. **Gestión Contable y Financiera**
   - Administración del plan contable multiempresa
   - Registro y consulta de asientos contables
   - Cierres mensuales y anuales
   - Consolidación de estados financieros

2. **Control de Compras y Proveedores**
   - Gestión de proveedores y homologación
   - Creación y seguimiento de órdenes de compra
   - Recepción de mercancías
   - Validación y registro de facturas de proveedores

3. **Administración de Ventas y Facturación**
   - Registro de pedidos de clientes
   - Emisión de facturas electrónicas
   - Notas de crédito/débito
   - Control de cartera y cobros

4. **Gestión de Inventario y Almacenes**
   - Control de stock en múltiples almacenes
   - Gestión de lotes y series
   - Movimientos y transferencias
   - Conteos cíclicos y valoraciones

5. **Planificación y Control de Producción**
   - Gestión de órdenes de fabricación
   - Listas de materiales (BOM)
   - Control de consumos y mermas
   - Cálculo de costes de producción

6. **Gestión de Proyectos y Costes**
   - Seguimiento de proyectos
   - Control presupuestario
   - Imputación de costes
   - Análisis de rentabilidad

7. **Tesorería y Conciliaciones Bancarias**
   - Gestión de cuentas bancarias
   - Previsiones de flujo de caja
   - Conciliaciones automáticas
   - Control de pagos y cobros

8. **Integración Transversal**
   - Consumir datos de CORE (empresas, divisas, calendarios)
   - Recibir costes de RRHH (nóminas)
   - Proveer datos financieros a BI
   - Integrarse con BPM para aprobaciones

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

El módulo ERP Frontend está diseñado siguiendo estos principios arquitectónicos:

#### 1. **Separación de Responsabilidades**

```
┌─────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN           │
│  (Páginas y Componentes Visuales)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO       │
│    (Custom Hooks y Context)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE SERVICIOS               │
│    (Comunicación con API)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           BACKEND API                   │
│      (Endpoints RESTful)                │
└─────────────────────────────────────────┘
```

#### 2. **Composición de Componentes**

- **Componentes Atómicos**: Botones, inputs, badges (reutilizables globalmente)
- **Componentes Moleculares**: Cards, tablas, formularios (específicos del módulo)
- **Componentes Organismos**: Secciones completas, layouts
- **Páginas**: Composición de organismos y contexto específico

#### 3. **Gestión de Estado Predictible**

- **Estado Local**: `useState` para componentes individuales
- **Estado Compartido**: Context API para el módulo
- **Estado de Servidor**: React Query o custom hooks con caché

#### 4. **Code Splitting y Lazy Loading**

```javascript
// Optimización de carga
const AccountingList = lazy(() => import('./pages/AccountingList'));
const PurchaseOrderDetail = lazy(() => import('./pages/PurchaseOrderDetail'));
```

---

## 🔗 Integración con Backend

### Concordancia con Backend ERP

El módulo frontend está **completamente alineado** con la documentación del backend ERP:

#### Entidades Gestionadas

| Entidad Backend | Representación Frontend | Pantallas Asociadas |
|----------------|------------------------|---------------------|
| Plan Contable | Chart of Accounts Tree | AccountingSettings |
| Asientos Contables | Journal Entries | AccountingList, JournalEntryForm |
| Proveedores | Supplier Objects | SupplierList, SupplierDetail |
| Órdenes de Compra | Purchase Order Documents | PurchaseOrderList, PurchaseOrderForm |
| Clientes | Customer Objects | CustomerList, CustomerDetail |
| Pedidos/Facturas | Sales Documents | SalesOrderList, InvoiceList |
| Artículos Inventario | Product/Item Objects | InventoryList, ItemDetail |
| Movimientos Stock | Stock Movements | StockMovementsList |
| Órdenes Fabricación | Production Orders | ProductionOrderList |
| Proyectos | Project Objects | ProjectList, ProjectDetail |
| Conciliaciones | Bank Reconciliations | BankReconciliation |

#### Mapeo de Endpoints

Todos los endpoints consumidos están documentados en el backend:

| Operación | Método | Endpoint | Pantalla Frontend |
|-----------|--------|----------|-------------------|
| **Contabilidad** |
| Listar plan contable | GET | `/api/v1/accounting/chart-of-accounts` | AccountingSettings |
| Listar asientos | GET | `/api/v1/accounting/journal-entries` | AccountingList |
| Crear asiento | POST | `/api/v1/accounting/journal-entries` | JournalEntryForm |
| Ejecutar cierre | POST | `/api/v1/accounting/closing-periods` | ClosingPeriodForm |
| Balance de situación | GET | `/api/v1/accounting/balance-sheet` | FinancialReports |
| Cuenta de resultados | GET | `/api/v1/accounting/profit-loss` | FinancialReports |
| **Compras** |
| Listar proveedores | GET | `/api/v1/purchasing/suppliers` | SupplierList |
| Crear proveedor | POST | `/api/v1/purchasing/suppliers` | SupplierForm |
| Listar órdenes compra | GET | `/api/v1/purchasing/purchase-orders` | PurchaseOrderList |
| Crear orden compra | POST | `/api/v1/purchasing/purchase-orders` | PurchaseOrderForm |
| Recepción mercancía | POST | `/api/v1/purchasing/receipts` | ReceiptForm |
| Registrar factura | POST | `/api/v1/purchasing/supplier-invoices` | SupplierInvoiceForm |
| **Ventas** |
| Listar clientes | GET | `/api/v1/sales/customers` | CustomerList |
| Crear pedido | POST | `/api/v1/sales/sales-orders` | SalesOrderForm |
| Emitir factura | POST | `/api/v1/sales/invoices` | InvoiceForm |
| Control cartera | GET | `/api/v1/sales/receivables-aging` | ReceivablesReport |
| **Inventario** |
| Listar artículos | GET | `/api/v1/inventory/items` | InventoryList |
| Stock por almacén | GET | `/api/v1/inventory/stock-levels` | StockLevels |
| Movimientos stock | GET | `/api/v1/inventory/stock-movements` | StockMovementsList |
| Transferencia | POST | `/api/v1/inventory/transfers` | TransferForm |
| Conteo físico | POST | `/api/v1/inventory/physical-counts` | PhysicalCountForm |
| **Producción** |
| Listar órdenes trabajo | GET | `/api/v1/production/work-orders` | ProductionOrderList |
| Crear orden trabajo | POST | `/api/v1/production/work-orders` | ProductionOrderForm |
| Registrar avance | POST | `/api/v1/production/work-orders/:id/progress` | ProgressForm |
| Consumo materiales | POST | `/api/v1/production/material-consumption` | ConsumptionForm |
| **Proyectos** |
| Listar proyectos | GET | `/api/v1/projects` | ProjectList |
| Crear proyecto | POST | `/api/v1/projects` | ProjectForm |
| Imputar costes | POST | `/api/v1/projects/:id/cost-allocations` | CostAllocationForm |
| Análisis rentabilidad | GET | `/api/v1/projects/:id/profitability` | ProjectProfitability |
| **Tesorería** |
| Listar cuentas bancarias | GET | `/api/v1/treasury/bank-accounts` | BankAccountList |
| Previsión flujo caja | GET | `/api/v1/treasury/cash-flow-forecast` | CashFlowForecast |
| Conciliación bancaria | POST | `/api/v1/treasury/reconciliations` | BankReconciliation |

---

## 🖥️ Pantallas y Funcionalidades

### 1. Listado de Asientos Contables (`AccountingList.jsx`)

#### Funcionalidad Completa

**Propósito**: Proporcionar una vista general de todos los asientos contables con capacidades de búsqueda, filtrado y consulta.

**Características**:

- ✅ **Tabla Responsive**: Adaptable a diferentes tamaños de pantalla
- ✅ **Búsqueda en Tiempo Real**: Por número de asiento, concepto o cuenta
- ✅ **Filtros Múltiples**:
  - Por periodo contable
  - Por tipo de asiento (apertura, normal, cierre, ajuste)
  - Por diario contable
  - Por estado (borrador, confirmado, cerrado)
- ✅ **Ordenación**: Por fecha, número, importe
- ✅ **Paginación**: Con selector de elementos por página
- ✅ **Acciones Rápidas**:
  - Ver detalle del asiento
  - Editar (si no está cerrado)
  - Duplicar asiento
  - Exportar a PDF
- ✅ **Estadísticas Rápidas**:
  - Total debe/haber del periodo
  - Asientos pendientes de confirmar
  - Balance de comprobación

**Permisos Requeridos**:
- `erp.accounting.view` - Ver asientos
- `erp.accounting.create` - Crear asientos
- `erp.accounting.edit` - Editar asientos
- `erp.accounting.delete` - Eliminar asientos borrador

**Navegación**:
- **Desde**: Menú lateral → ERP → Contabilidad
- **Hacia**: 
  - JournalEntryDetail (clic en fila)
  - JournalEntryForm (botón nuevo/editar)

---

### 2. Órdenes de Compra (`PurchaseOrderList.jsx`)

#### Funcionalidad Completa

**Propósito**: Gestionar el ciclo completo de órdenes de compra desde la creación hasta la recepción.

**Características**:

- ✅ **Workflow Visual**: Indicadores de estado (borrador, enviada, parcial, completa, cancelada)
- ✅ **Búsqueda**: Por número de orden, proveedor o artículo
- ✅ **Filtros**:
  - Por proveedor
  - Por estado
  - Por fecha estimada de entrega
  - Por comprador
- ✅ **Acciones por Estado**:
  - Borrador: Editar, Enviar, Eliminar
  - Enviada: Ver, Recibir parcial, Cancelar
  - Parcial: Ver, Recibir resto, Cerrar
  - Completa: Ver, Generar factura
- ✅ **Indicadores Visuales**:
  - Órdenes vencidas en rojo
  - Recepciones parciales en amarillo
  - Órdenes completas en verde

**Permisos Requeridos**:
- `erp.purchasing.view` - Ver órdenes
- `erp.purchasing.create` - Crear órdenes
- `erp.purchasing.approve` - Aprobar órdenes
- `erp.purchasing.receive` - Recibir mercancía

---

### 3. Gestión de Inventario (`InventoryList.jsx`)

#### Funcionalidad Completa

**Propósito**: Control centralizado del stock en todos los almacenes con alertas y trazabilidad.

**Características**:

- ✅ **Vista Multi-Almacén**: Stock total y por ubicación
- ✅ **Alertas de Stock**:
  - Productos bajo mínimo (rojo)
  - Productos cercanos a mínimo (amarillo)
  - Stock óptimo (verde)
- ✅ **Trazabilidad de Lotes**: Vencimientos, números de serie
- ✅ **Valoración**: Costo promedio, FIFO, LIFO
- ✅ **Movimientos Recientes**: Histórico de entradas/salidas
- ✅ **Acciones**:
  - Ver movimientos detallados
  - Transferir entre almacenes
  - Ajustar inventario
  - Generar conteo físico

**Permisos Requeridos**:
- `erp.inventory.view` - Ver inventario
- `erp.inventory.transfer` - Transferir stock
- `erp.inventory.adjust` - Ajustar stock
- `erp.inventory.count` - Realizar conteos

---

### 4. Facturación de Clientes (`InvoiceList.jsx`)

#### Funcionalidad Completa

**Propósito**: Emisión, control y seguimiento de facturas de venta.

**Características**:

- ✅ **Emisión Electrónica**: Generación de XML según normativa
- ✅ **Estados de Factura**: Borrador, Emitida, Pagada, Vencida, Anulada
- ✅ **Control de Cobros**: Aging de cartera
- ✅ **Notas de Crédito/Débito**: Gestión de ajustes
- ✅ **Recordatorios Automáticos**: Por vencimientos
- ✅ **Acciones**:
  - Enviar por email
  - Descargar PDF
  - Registrar pago
  - Emitir nota de crédito
  - Vincular a pedido

**Permisos Requeridos**:
- `erp.sales.view` - Ver facturas
- `erp.sales.create` - Emitir facturas
- `erp.sales.cancel` - Anular facturas
- `erp.sales.payment` - Registrar pagos

---

### 5. Órdenes de Fabricación (`ProductionOrderList.jsx`)

#### Funcionalidad Completa

**Propósito**: Planificar, ejecutar y controlar órdenes de producción.

**Características**:

- ✅ **Planificación**: Listas de materiales (BOM) y rutas
- ✅ **Control de Avance**: Porcentaje completado
- ✅ **Registro de Consumos**: Materiales y tiempo
- ✅ **Control de Mermas**: Desviaciones y desperdicios
- ✅ **Costes Reales vs Estándar**: Análisis de variaciones
- ✅ **Acciones**:
  - Iniciar producción
  - Registrar avance
  - Consumir materiales
  - Completar orden
  - Calcular costes

**Permisos Requeridos**:
- `erp.production.view` - Ver órdenes
- `erp.production.create` - Crear órdenes
- `erp.production.execute` - Ejecutar producción
- `erp.production.close` - Cerrar órdenes

---

### 6. Gestión de Proyectos (`ProjectList.jsx`)

#### Funcionalidad Completa

**Propósito**: Seguimiento económico de proyectos internos y externos.

**Características**:

- ✅ **Control Presupuestario**: Budget vs Real
- ✅ **Imputación de Costes**: Materiales, tiempo, servicios
- ✅ **Centros de Beneficio**: Análisis de rentabilidad
- ✅ **Facturación por Hitos**: Avances de obra
- ✅ **Dashboard de Proyecto**: KPIs financieros
- ✅ **Acciones**:
  - Ver detalle económico
  - Imputar costes
  - Generar factura
  - Cerrar proyecto

**Permisos Requeridos**:
- `erp.projects.view` - Ver proyectos
- `erp.projects.allocate` - Imputar costes
- `erp.projects.invoice` - Facturar
- `erp.projects.close` - Cerrar proyectos

---

### 7. Conciliación Bancaria (`BankReconciliation.jsx`)

#### Funcionalidad Completa

**Propósito**: Conciliar movimientos bancarios con registros contables.

**Características**:

- ✅ **Importación de Extractos**: Archivo bancario (MT940, CSV)
- ✅ **Matching Automático**: Por importe, referencia, fecha
- ✅ **Conciliación Manual**: Para casos especiales
- ✅ **Partidas en Tránsito**: Identificación de diferencias
- ✅ **Generación de Asientos**: Automática al conciliar
- ✅ **Acciones**:
  - Importar extracto
  - Conciliar automático
  - Conciliar manual
  - Ver diferencias
  - Cerrar conciliación

**Permisos Requeridos**:
- `erp.treasury.view` - Ver conciliaciones
- `erp.treasury.reconcile` - Conciliar
- `erp.treasury.adjust` - Ajustes

---

## 📊 Componentes Reutilizables

### Componentes Financieros

1. **AccountPicker**: Selector de cuentas contables con búsqueda
2. **AmountInput**: Input de importes con formato de moneda
3. **PeriodSelector**: Selector de periodos contables
4. **BalanceCard**: Card con balance debe/haber
5. **JournalEntryLines**: Tabla de líneas de asiento con validación

### Componentes de Compras/Ventas

1. **SupplierPicker**: Buscador de proveedores
2. **CustomerPicker**: Buscador de clientes
3. **DocumentStatusBadge**: Badge de estado de documentos
4. **PaymentTermsSelector**: Selector de condiciones de pago
5. **TaxCalculator**: Calculadora de impuestos

### Componentes de Inventario

1. **ItemPicker**: Buscador de artículos
2. **WarehouseSelector**: Selector de almacenes
3. **StockLevelIndicator**: Indicador visual de stock
4. **LotSerialPicker**: Selector de lotes/series
5. **StockMovementTimeline**: Timeline de movimientos

### Componentes de Producción

1. **BOMViewer**: Visualizador de lista de materiales
2. **WorkOrderProgress**: Barra de progreso de orden
3. **MaterialConsumption**: Registro de consumos
4. **CostAnalysis**: Análisis de costes
5. **RouteSteps**: Pasos de ruta de fabricación

---

## 🔐 Gestión de Permisos

### Estructura de Permisos

```javascript
const ERP_PERMISSIONS = {
  // Contabilidad
  'erp.accounting.view': 'Ver datos contables',
  'erp.accounting.create': 'Crear asientos',
  'erp.accounting.edit': 'Editar asientos',
  'erp.accounting.delete': 'Eliminar asientos',
  'erp.accounting.close': 'Cerrar periodos',
  
  // Compras
  'erp.purchasing.view': 'Ver compras',
  'erp.purchasing.create': 'Crear órdenes',
  'erp.purchasing.approve': 'Aprobar órdenes',
  'erp.purchasing.receive': 'Recibir mercancía',
  
  // Ventas
  'erp.sales.view': 'Ver ventas',
  'erp.sales.create': 'Crear facturas',
  'erp.sales.cancel': 'Anular facturas',
  'erp.sales.payment': 'Registrar pagos',
  
  // Inventario
  'erp.inventory.view': 'Ver inventario',
  'erp.inventory.transfer': 'Transferir stock',
  'erp.inventory.adjust': 'Ajustar stock',
  'erp.inventory.count': 'Conteos físicos',
  
  // Producción
  'erp.production.view': 'Ver producción',
  'erp.production.create': 'Crear órdenes',
  'erp.production.execute': 'Ejecutar órdenes',
  'erp.production.close': 'Cerrar órdenes',
  
  // Proyectos
  'erp.projects.view': 'Ver proyectos',
  'erp.projects.allocate': 'Imputar costes',
  'erp.projects.invoice': 'Facturar',
  'erp.projects.close': 'Cerrar proyectos',
  
  // Tesorería
  'erp.treasury.view': 'Ver tesorería',
  'erp.treasury.reconcile': 'Conciliar',
  'erp.treasury.adjust': 'Ajustes',
  'erp.treasury.payment': 'Autorizar pagos'
};
```

---

## 🧪 Estrategia de Testing

### Tests Unitarios

```javascript
// Ejemplo: tests de componentes
describe('JournalEntryForm', () => {
  it('valida balance debe/haber', () => {...});
  it('previene crear asiento desbalanceado', () => {...});
  it('aplica validaciones de periodo cerrado', () => {...});
});
```

### Tests de Integración

```javascript
// Ejemplo: flujo completo de compra
describe('Purchase Order Flow', () => {
  it('crea orden → recibe → genera factura → paga', async () => {...});
});
```

### Tests E2E

```javascript
// Ejemplo: cierre contable
describe('Closing Period E2E', () => {
  it('ejecuta cierre mensual completo', () => {...});
});
```

---

## 🚀 Optimizaciones de Performance

### Lazy Loading de Submódulos

```javascript
const AccountingModule = lazy(() => import('./modules/accounting'));
const PurchasingModule = lazy(() => import('./modules/purchasing'));
const SalesModule = lazy(() => import('./modules/sales'));
const InventoryModule = lazy(() => import('./modules/inventory'));
const ProductionModule = lazy(() => import('./modules/production'));
```

### Memoización de Cálculos Complejos

```javascript
const balanceSheet = useMemo(() => 
  calculateBalanceSheet(accounts, transactions, period),
  [accounts, transactions, period]
);
```