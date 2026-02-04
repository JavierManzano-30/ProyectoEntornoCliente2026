// Datos mockeados para el módulo de BI multi-tenant

// ============ KPIs POR EMPRESA ============
export const mockKPIs = {
  1: { // TechCorp Solutions
    ingresosTotales: { value: 1850000, change: 12.5, trend: 'up' },
    costesOperativos: { value: 680000, change: -3.2, trend: 'down' },
    beneficioNeto: { value: 1170000, change: 18.4, trend: 'up' },
    clientesActivos: { value: 245, change: 8.1, trend: 'up' },
    tasaConversion: { value: 34.5, change: 2.3, trend: 'up' },
    ticketMedio: { value: 7551, change: 5.7, trend: 'up' },
  },
  2: { // InnovaDigital S.A.
    ingresosTotales: { value: 985000, change: 15.3, trend: 'up' },
    costesOperativos: { value: 420000, change: -1.8, trend: 'down' },
    beneficioNeto: { value: 565000, change: 22.1, trend: 'up' },
    clientesActivos: { value: 156, change: 12.4, trend: 'up' },
    tasaConversion: { value: 28.7, change: 3.9, trend: 'up' },
    ticketMedio: { value: 6314, change: 2.1, trend: 'up' },
  },
  3: { // GlobalServices Ltd
    ingresosTotales: { value: 2340000, change: 9.8, trend: 'up' },
    costesOperativos: { value: 895000, change: -2.5, trend: 'down' },
    beneficioNeto: { value: 1445000, change: 14.6, trend: 'up' },
    clientesActivos: { value: 387, change: 6.3, trend: 'up' },
    tasaConversion: { value: 41.2, change: 1.8, trend: 'up' },
    ticketMedio: { value: 6046, change: 3.4, trend: 'up' },
  },
};

// ============ DATOS DE GRÁFICOS POR EMPRESA ============
export const mockDashboardData = {
  1: { // TechCorp Solutions
    ingresosPorMes: [
      { mes: 'Ago', ingresos: 145000, costes: 52000 },
      { mes: 'Sep', ingresos: 158000, costes: 55000 },
      { mes: 'Oct', ingresos: 162000, costes: 58000 },
      { mes: 'Nov', ingresos: 148000, costes: 54000 },
      { mes: 'Dic', ingresos: 175000, costes: 61000 },
      { mes: 'Ene', ingresos: 185000, costes: 68000 },
    ],
    ventasPorCategoria: [
      { categoria: 'Software', valor: 850000, porcentaje: 46 },
      { categoria: 'Consultoría', valor: 650000, porcentaje: 35 },
      { categoria: 'Soporte', valor: 350000, porcentaje: 19 },
    ],
    clientesPorRegion: [
      { region: 'Europa', clientes: 125, valor: 980000 },
      { region: 'América', clientes: 75, valor: 560000 },
      { region: 'Asia', clientes: 45, valor: 310000 },
    ],
    topProductos: [
      { producto: 'ERP Enterprise', ventas: 45, ingresos: 675000 },
      { producto: 'CRM Cloud', ventas: 62, ingresos: 465000 },
      { producto: 'BI Analytics', ventas: 38, ingresos: 380000 },
      { producto: 'Módulo RRHH', ventas: 28, ingresos: 210000 },
      { producto: 'Soporte Premium', ventas: 72, ingresos: 120000 },
    ],
  },
  2: { // InnovaDigital S.A.
    ingresosPorMes: [
      { mes: 'Ago', ingresos: 78000, costes: 32000 },
      { mes: 'Sep', ingresos: 85000, costes: 35000 },
      { mes: 'Oct', ingresos: 91000, costes: 38000 },
      { mes: 'Nov', ingresos: 82000, costes: 34000 },
      { mes: 'Dic', ingresos: 95000, costes: 41000 },
      { mes: 'Ene', ingresos: 98000, costes: 42000 },
    ],
    ventasPorCategoria: [
      { categoria: 'Marketing Digital', valor: 425000, porcentaje: 43 },
      { categoria: 'Desarrollo Web', valor: 360000, porcentaje: 37 },
      { categoria: 'Diseño UX/UI', valor: 200000, porcentaje: 20 },
    ],
    clientesPorRegion: [
      { region: 'España', clientes: 98, valor: 620000 },
      { region: 'Latinoamérica', clientes: 42, valor: 265000 },
      { region: 'Europa', clientes: 16, valor: 100000 },
    ],
    topProductos: [
      { producto: 'Campaña SEO/SEM', ventas: 48, ingresos: 288000 },
      { producto: 'Desarrollo Ecommerce', ventas: 22, ingresos: 242000 },
      { producto: 'Branding Corporativo', ventas: 31, ingresos: 155000 },
      { producto: 'App Móvil', ventas: 18, ingresos: 180000 },
      { producto: 'Gestión Redes Sociales', ventas: 37, ingresos: 120000 },
    ],
  },
  3: { // GlobalServices Ltd
    ingresosPorMes: [
      { mes: 'Ago', ingresos: 185000, costes: 72000 },
      { mes: 'Sep', ingresos: 198000, costes: 76000 },
      { mes: 'Oct', ingresos: 212000, costes: 81000 },
      { mes: 'Nov', ingresos: 195000, costes: 74000 },
      { mes: 'Dic', ingresos: 225000, costes: 88000 },
      { mes: 'Ene', ingresos: 234000, costes: 89500 },
    ],
    ventasPorCategoria: [
      { categoria: 'Logística', valor: 1050000, porcentaje: 45 },
      { categoria: 'Distribución', valor: 820000, porcentaje: 35 },
      { categoria: 'Almacenamiento', valor: 470000, porcentaje: 20 },
    ],
    clientesPorRegion: [
      { region: 'Reino Unido', clientes: 165, valor: 1250000 },
      { region: 'Europa Continental', clientes: 142, valor: 780000 },
      { region: 'Norteamérica', clientes: 80, valor: 310000 },
    ],
    topProductos: [
      { producto: 'Transporte Internacional', ventas: 125, ingresos: 875000 },
      { producto: 'Almacén Automatizado', ventas: 45, ingresos: 585000 },
      { producto: 'Gestión Inventario', ventas: 87, ingresos: 435000 },
      { producto: 'Last Mile Delivery', ventas: 98, ingresos: 294000 },
      { producto: 'Fulfillment', ventas: 32, ingresos: 151000 },
    ],
  },
};

// ============ REPORTES ============
export const mockReports = [
  { 
    id: 1, 
    nombre: 'Análisis de Ventas Mensual', 
    tipo: 'Ventas', 
    ultimaEjecucion: '2026-02-03T10:30:00', 
    estado: 'activo',
    empresaId: null, // Compartido
  },
  { 
    id: 2, 
    nombre: 'ROI por Canal de Marketing', 
    tipo: 'Marketing', 
    ultimaEjecucion: '2026-02-02T14:20:00', 
    estado: 'activo',
    empresaId: 2,
  },
  { 
    id: 3, 
    nombre: 'Rendimiento Operativo', 
    tipo: 'Operaciones', 
    ultimaEjecucion: '2026-02-01T09:15:00', 
    estado: 'activo',
    empresaId: 3,
  },
  { 
    id: 4, 
    nombre: 'Balance Financiero Trimestral', 
    tipo: 'Finanzas', 
    ultimaEjecucion: '2026-01-31T16:45:00', 
    estado: 'pendiente',
    empresaId: null,
  },
  { 
    id: 5, 
    nombre: 'Análisis de Clientes Premium', 
    tipo: 'Ventas', 
    ultimaEjecucion: '2026-01-30T11:00:00', 
    estado: 'activo',
    empresaId: 1,
  },
];

// ============ DATASETS ============
export const mockDatasets = {
  1: [
    { id: 1, nombre: 'Ventas 2025', registros: 15420, ultimaActualizacion: '2026-02-04T08:00:00', estado: 'sincronizado' },
    { id: 2, nombre: 'Clientes Activos', registros: 245, ultimaActualizacion: '2026-02-04T06:30:00', estado: 'sincronizado' },
    { id: 3, nombre: 'Transacciones', registros: 8965, ultimaActualizacion: '2026-02-03T22:15:00', estado: 'sincronizado' },
  ],
  2: [
    { id: 4, nombre: 'Campañas Marketing', registros: 2340, ultimaActualizacion: '2026-02-04T07:45:00', estado: 'sincronizado' },
    { id: 5, nombre: 'Clientes Digitales', registros: 156, ultimaActualizacion: '2026-02-04T05:20:00', estado: 'sincronizado' },
    { id: 6, nombre: 'Conversiones Web', registros: 4520, ultimaActualizacion: '2026-02-03T18:30:00', estado: 'procesando' },
  ],
  3: [
    { id: 7, nombre: 'Envíos Internacionales', registros: 18750, ultimaActualizacion: '2026-02-04T09:10:00', estado: 'sincronizado' },
    { id: 8, nombre: 'Inventario Global', registros: 6830, ultimaActualizacion: '2026-02-04T07:00:00', estado: 'sincronizado' },
    { id: 9, nombre: 'Rutas Optimizadas', registros: 952, ultimaActualizacion: '2026-02-04T04:45:00', estado: 'sincronizado' },
  ],
};

// ============ ALERTAS ============
export const mockAlerts = {
  1: [
    { id: 1, tipo: 'warning', mensaje: 'Costes operativos aumentaron 5% esta semana', fecha: '2026-02-04T09:00:00', leida: false },
    { id: 2, tipo: 'success', mensaje: 'Meta de ventas Q1 alcanzada (102%)', fecha: '2026-02-03T14:30:00', leida: false },
    { id: 3, tipo: 'info', mensaje: 'Nuevo reporte disponible: Análisis de Clientes', fecha: '2026-02-02T10:15:00', leida: true },
  ],
  2: [
    { id: 4, tipo: 'error', mensaje: 'Dataset "Conversiones Web" falló al sincronizar', fecha: '2026-02-04T08:20:00', leida: false },
    { id: 5, tipo: 'success', mensaje: 'ROI de campaña SEO superó objetivo (+45%)', fecha: '2026-02-03T16:45:00', leida: false },
  ],
  3: [
    { id: 6, tipo: 'warning', mensaje: 'Retrasos en rutas zona norte (+12%)', fecha: '2026-02-04T07:30:00', leida: false },
    { id: 7, tipo: 'info', mensaje: 'Optimización de almacén completada', fecha: '2026-02-03T11:00:00', leida: true },
    { id: 8, tipo: 'success', mensaje: 'Reducción de costes logísticos (-8%)', fecha: '2026-02-02T15:20:00', leida: true },
  ],
};
