# Documentación Técnica - Módulo BI Frontend

---

## 🎯 Visión General

### Propósito del Módulo

El módulo **BI (Business Intelligence)** del frontend proporciona una interfaz completa para la visualización, análisis y generación de informes basados en los datos operativos de toda la plataforma empresarial.

Este módulo actúa como **centro de inteligencia de negocio**, proporcionando herramientas para directivos, analistas de datos y usuarios que necesitan tomar decisiones basadas en información consolidada.

### Objetivos Principales

1. **Dashboards Interactivos**
   - Dashboard global con KPIs principales
   - Dashboards específicos por módulo
   - Filtros dinámicos por periodo y empresa

2. **Catálogo de Informes**
   - Informes predefinidos y personalizados
   - Búsqueda, ejecución y exportación
   - Histórico de ejecuciones

3. **Generación y Exportación**
   - Creación de informes personalizados
   - Exportación múltiple (PDF, Excel, CSV)
   - Envío programado

4. **Visualización de Datos**
   - Gráficos interactivos
   - Tablas dinámicas con drill-down
   - Indicadores KPI con tendencias

5. **Gestión de Datasets**
   - Configuración de fuentes de datos
   - Programación de refrescos
   - Monitorización de calidad

6. **Alertas y Monitorización**
   - Definición de umbrales
   - Notificaciones automáticas
   - Historial de alertas

---

## 🏗️ Arquitectura del Módulo

### Principios de Diseño

El módulo BI Frontend está diseñado siguiendo estos principios arquitectónicos:

#### 1. **Separación de Responsabilidades**

```
┌─────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN           │
│   (Dashboards y Visualizaciones)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE LÓGICA DE NEGOCIO       │
│    (Procesamiento de Datos, Filtros)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         CAPA DE SERVICIOS               │
│    (API de Métricas y Datasets)         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           BACKEND BI API                │
│   (Motor de Consultas y Agregaciones)   │
└─────────────────────────────────────────┘
```

#### 2. **Composición de Componentes**

- **Componentes Atómicos**: Indicadores KPI, badges, selectores
- **Componentes Moleculares**: Widgets de gráficos, cards de métricas, filtros
- **Componentes Organismos**: Dashboards completos, builders de informes
- **Páginas**: Composición con contexto y permisos

#### 3. **Gestión de Estado Predictible**

- **Estado Local**: `useState` para filtros y configuraciones
- **Estado Compartido**: Context API para filtros globales y periodo
- **Estado de Servidor**: Custom hooks con caché para datasets y métricas

#### 4. **Code Splitting y Lazy Loading**

```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ReportBuilder = lazy(() => import('./pages/ReportBuilder'));
const DatasetManager = lazy(() => import('./pages/DatasetManager'));
```

---

## 🔗 Integración con Backend

El frontend BI está **completamente alineado** con la API y modelo de datos del backend BI:

#### Entidades Gestionadas

| Entidad Backend | Representación Frontend | Pantallas Asociadas |
|-----------------|------------------------|---------------------|
| Dashboards      | Dashboard Objects      | DashboardView, DashboardBuilder |
| Informes        | Report Objects         | ReportList, ReportViewer, ReportBuilder |
| Datasets        | Dataset Definitions    | DatasetManager, DatasetEditor |
| KPIs            | Metric Cards           | Dashboard, KPIViewer |
| Alertas         | Alert Rules            | AlertManager, AlertConfig |

#### Mapeo de Endpoints (Ejemplo)

| Operación                  | Método | Endpoint aproximado                     | Pantalla Frontend  |
|----------------------------|--------|-----------------------------------------|--------------------|
| Dashboard global           | GET    | `/api/v1/bi/dashboards/global`          | DashboardView      |
| Dashboard por módulo       | GET    | `/api/v1/bi/dashboards/:modulo`         | ModuleDashboard    |
| Listar informes            | GET    | `/api/v1/bi/informes`                   | ReportList         |
| Ejecutar informe           | POST   | `/api/v1/bi/informes/:id/ejecutar`      | ReportViewer       |
| Exportar informe           | POST   | `/api/v1/bi/informes/:id/exportar`      | ReportViewer       |
| Crear informe              | POST   | `/api/v1/bi/informes`                   | ReportBuilder      |
| Listar datasets            | GET    | `/api/v1/bi/datasets`                   | DatasetManager     |
| Refrescar dataset          | POST   | `/api/v1/bi/datasets/:id/refrescar`     | DatasetManager     |
| Listar alertas             | GET    | `/api/v1/bi/alertas`                    | AlertManager       |
| Crear alerta               | POST   | `/api/v1/bi/alertas`                    | AlertConfig        |

---

---

## 🖥️ Pantallas y Funcionalidades

### 1. Dashboard Global (`DashboardView.jsx`)

**Propósito**: Proporcionar vista consolidada de KPIs principales de la empresa.

**Estructura y Flujos**:
- Tarjetas de KPIs: Ingresos totales, clientes activos, proyectos en curso, empleados activos, tickets abiertos
- Gráficos principales: Evolución de ingresos, distribución de clientes, proyectos por estado, ausentismo
- Tabla de métricas por módulo con drill-down
- Filtros globales: periodo, empresa, comparativa con periodo anterior
- Panel de alertas activas

**Acciones**:
- Exportar dashboard a PDF
- Programar envío automático
- Refrescar datos
- Compartir enlace

**Permisos**: `bi.view_dashboard`, `bi.view_all_companies`, `bi.export`

---

### 2. Dashboards por Módulo (`ModuleDashboard.jsx`)

**Propósito**: Mostrar métricas específicas de cada módulo operativo.

**Estructura por Módulo**:

**RRHH**: Total empleados, rotación, ausentismo, coste salarial
**CRM**: Clientes activos, nuevos clientes, tasa de conversión, pipeline value
**ALM**: Proyectos activos, tareas completadas, horas trabajadas, velocidad
**BPM**: Instancias activas, tareas pendientes, SLA cumplido, tiempo ciclo
**ERP**: Facturación mensual, inventario, cuentas por cobrar, margen bruto
**Soporte**: Tickets abiertos, tiempo medio resolución, satisfacción, backlog

**Funcionalidades Comunes**:
- Filtros por periodo
- Drill-down en gráficos
- Exportación individual
- Navegación al módulo operativo

**Permisos**: `bi.view_module_dashboard` + permisos específicos del módulo 
  - Embudo de conversión (funnel chart)
  - Oportunidades por fase (bar chart)
  - Actividades por comercial (bar chart)
  - Ingresos por cliente top 10 (bar chart horizontal)
---

### 3. Catálogo de Informes (`ReportList.jsx`)

**Propósito**: Centralizar todos los informes disponibles.

**Estructura de la Pantalla**:
- Cards de informes con: nombre, descripción, categoría, frecuencia, última ejecución, botón "Ver"
- Categorías: Predefinidos del sistema, personalizados
- Filtros: módulo, tipo, frecuencia, autor, favoritos
- Búsqueda por nombre/descripción
- Acciones masivas: ejecutar, exportar, añadir a favoritos

**Acciones**:
- Crear nuevo informe
- Importar plantilla
- Ver historial
- Gestionar programaciones

**Permisos**: `bi.view_reports`, `bi.create_reports`, `bi.execute_reports`

---

### 4. Visor de Informes (`ReportViewer.jsx`)

#### Funcionalidad Completa

**Propósito**: Ejecutar, visualizar y exportar informes específicos.

**Características**: 

**Cabecera del Informe**:
- Nombre del informe
- Descripción completa
- Módulo origen (badge)
- Autor y fecha de creación
- Última ejecución
- Botones de acción: 
  - Ejecutar ahora
  - Programar
  - Exportar
  - Compartir
  - Editar (si es propietario)
  - Duplicar
  - Añadir a favoritos

**Panel de Parámetros** (si el informe los requiere):
- Selector de periodo (obligatorio generalmente)
- Filtros específicos del informe: 
  - Empresa
  - Departamento
  - Proyecto
  - Cliente
  - Usuario responsable
  - Estado
  - Categoría
- Botón "Aplicar filtros"
- Botón "Restablecer"
- Guardar configuración como predeterminada

**Área de Visualización**: 

**Modo Tabla**:
- Tabla dinámica con los resultados
- Columnas configurables (mostrar/ocultar)
- Ordenación por columnas
- Filtrado inline
- Paginación
- Totales y subtotales
- Drill-down en filas (si aplica)
- Exportar tabla a Excel/CSV

**Modo Gráfico**:
- Visualización según tipo configurado: 
  - Line Chart (tendencias temporales)
  - Bar Chart (comparaciones)
  - Pie/Donut Chart (distribuciones)
  - Area Chart (evoluciones acumuladas)
  - Scatter Plot (correlaciones)
  - Heatmap (matrices de intensidad)
- Controles interactivos:
  - Zoom
  - Pan
  - Hover tooltips
  - Legends clickeables
  - Cambiar tipo de gráfico
- Exportar gráfico como imagen (PNG, SVG)

**Modo Mixto**:
- Combinación de gráficos y tablas
- Layout configurable (grid responsive)

**Panel de Resultados**:
- Indicador de última ejecución
- Tiempo de procesamiento
- Número de registros devueltos
- Alertas o advertencias (si aplica)

**Historial de Ejecuciones** (Tab lateral):
- Lista de ejecuciones previas
- Fecha y hora
- Parámetros utilizados
- Usuario ejecutor
- Estado (éxito, error)
- Tiempo de procesamiento
- Enlace para descargar resultado guardado
- Comparar con ejecución actual

**Programación** (Tab lateral):
- Frecuencia: 
  - Diaria (hora específica)
  - Semanal (día y hora)
  - Mensual (día del mes y hora)
  - Personalizada (cron expression)
- Parámetros por defecto
- Formato de exportación automática
- Destinatarios de email
- Activar/desactivar programación
- Historial de ejecuciones programadas

**Exportación**: 
Modal con opciones:
- Formato: 
  - PDF (con gráficos y tablas)
  - Excel (tablas con formato)
  - CSV (datos raw)
  - JSON (datos estructurados)
  - PNG (solo gráficos)
- Incluir: 
  - Parámetros utilizados
  - Fecha de generación
  - Logotipo de empresa
  - Marca de agua
- Enviar por email: 
  - Destinatarios
  - Asunto personalizado
  - Mensaje opcional
- Descargar directamente
- Generar enlace compartible (con expiración)

**Compartir**:
- Generar enlace público/privado
- Establecer expiración (1 día, 7 días, 30 días, nunca)
- Requerir autenticación
- Copiar enlace al portapapeles
- Compartir por email

**Permisos**:
- `bi.view_reports` - Ver informe
- `bi.execute_reports` - Ejecutar
- `bi.export_reports` - Exportar
- `bi.share_reports` - Compartir
- `bi.schedule_reports` - Programar

---

### 5. Constructor de Informes (`ReportBuilder.jsx`)

#### Funcionalidad Completa

**Propósito**: Crear y editar informes personalizados sin necesidad de código.

**Características**: 

**Paso 1: Información Básica**
- Nombre del informe*
- Descripción
- Categoría/Módulo
- Tipo de visualización: 
  - Solo tabla
  - Solo gráfico
  - Mixto (tabla + gráfico)
  - Dashboard multi-widget
- Icono representativo
- Tags (para búsqueda)

**Paso 2: Selección de Fuente de Datos**
- Origen: 
  - Dataset predefinido (selector)
  - Consulta personalizada (SQL asistido)
  - Combinación de múltiples datasets
- Vista previa de estructura
- Campos disponibles (con tipos de datos)

**Paso 3: Configuración de Campos**
- Selector de campos a incluir
- Drag & drop para ordenar
- Configuración por campo:
  - Alias (nombre a mostrar)
  - Formato (fecha, moneda, porcentaje, número)
  - Agregación (suma, promedio, conteo, mín, máx)
  - Filtros aplicables
  - Ordenación predeterminada
- Campos calculados (fórmulas simples)

**Paso 4: Filtros y Parámetros**
- Añadir filtros dinámicos: 
  - Campo a filtrar
  - Tipo de control (select, date range, input, checkbox)
  - Valores por defecto
  - Obligatorio/opcional
- Configurar relaciones entre filtros (dependencias)
- Vista previa de panel de filtros

**Paso 5: Visualización**
- Configurar gráfico (si aplica):
  - Tipo de gráfico
  - Eje X (dimensión)
  - Eje Y (métrica)
  - Series (agrupaciones)
  - Colores
  - Leyendas
  - Títulos y etiquetas
- Vista previa en tiempo real
- Cambiar tipo de gráfico y comparar

**Paso 6: Opciones Avanzadas**
- Paginación (registros por página)
- Ordenación predeterminada
- Totales y subtotales
- Drill-down (activar/desactivar)
- Refrescar datos automáticamente (intervalo)
- Límite máximo de registros (performance)

**Paso 7: Programación (Opcional)**
- Configurar ejecución automática
- Frecuencia
- Destinatarios
- Formato de exportación

**Paso 8: Revisión y Guardar**
- Vista previa completa del informe
- Ejecutar prueba con datos reales
- Validaciones: 
  - Nombre único
  - Al menos un campo seleccionado
  - Configuración válida de gráfico
- Botones: 
  - Guardar como borrador
  - Guardar y publicar
  - Cancelar

**Validaciones en Tiempo Real**:
- Sintaxis de consultas SQL (si aplica)
- Compatibilidad de tipos de datos en gráficos
- Rendimiento estimado de la consulta
- Límites de seguridad

**Permisos**: 
- `bi.create_reports` - Crear informes
- `bi.edit_reports` - Editar informes propios
- `bi.edit_all_reports` - Editar cualquier informe
- `bi.sql_access` - Crear consultas SQL personalizadas

---

### 6. Gestor de Datasets (`DatasetManager.jsx`)

#### Funcionalidad Completa

**Propósito**:  Administrar las fuentes de datos que alimentan los informes y dashboards.

**Características**: 

**Tabla de Datasets**: 
Columnas:
- Nombre del dataset
- Fuente (BBDD, API, archivo)
- Número de registros
- Última actualización (fecha y hora)
- Frecuencia de refresco (manual, cada hora, diario)
- Estado (activo, pausado, error)
- Utilizado en (número de informes que lo usan)
- Acciones (editar, refrescar, ver detalle)

**Filtros**:
- Por fuente de datos
- Por estado
- Por módulo
- Búsqueda por nombre

**Acciones sobre Datasets**:
- **Refrescar Ahora**: Ejecuta ETL manualmente
- **Programar Refresco**: Configurar frecuencia
- **Ver Logs**: Historial de actualizaciones
- **Editar Configuración**: Modificar transformaciones
- **Pausar/Reanudar**:  Detener refrescos automáticos
- **Duplicar**: Crear copia para testing
- **Eliminar**: Solo si no está en uso

**Detalle de Dataset**:
- Información general (nombre, descripción, autor)
- Esquema de datos (campos, tipos, descripción)
- Transformaciones aplicadas
- Estadísticas: 
  - Tamaño total (MB)
  - Número de registros
  - Tiempo promedio de refresco
  - Última actualización exitosa
- Vista previa de datos (primeras 100 filas)
- Dependencias (informes que lo usan)

**Crear Nuevo Dataset**: 
Wizard de configuración:
1. Seleccionar fuente:
   - Tabla/Vista de BBDD
   - API endpoint
   - Archivo CSV/Excel
   - Combinación de datasets existentes
2. Configurar extracción:
   - Query SQL o filtros
   - Parámetros de API
   - Mapeo de columnas
3. Definir transformaciones:
   - Renombrar campos
   - Cambiar tipos de datos
   - Filtros
   - Agregaciones
   - Joins (si combina datasets)
4. Programar refrescos:
   - Frecuencia
   - Hora específica
   - Retención de históricos
5. Validar y guardar

**Monitorización**:
- Panel con estado de todos los refrescos programados
- Alertas de fallos en actualización
- Gráfico de tiempo de procesamiento
- Log de errores con detalles técnicos

**Permisos**:
- `bi.view_datasets` - Ver datasets
- `bi.create_datasets` - Crear datasets
- `bi.edit_datasets` - Editar datasets
- `bi.refresh_datasets` - Ejecutar refrescos manuales
- `bi.sql_access` - Acceso directo a BBDD

---

### 7. Gestor de Alertas (`AlertManager.jsx`)

#### Funcionalidad Completa

**Propósito**:  Configurar y gestionar alertas automáticas basadas en umbrales de KPIs.

**Características**:

**Tabla de Alertas Configuradas**: 
Columnas:
- Nombre de la alerta
- KPI monitoreado
- Condición (>, <, =, >=, <=)
- Valor umbral
- Estado (activa, pausada)
- Última activación
- Destinatarios
- Acciones (editar, pausar, eliminar, historial)

**Estados de Alertas**:
- 🟢 **Activa - En rango**: Monitorea correctamente, sin disparos
- 🟡 **Activa - Disparada**: Condición cumplida, notificación enviada
- ⚫ **Pausada**:  Temporalmente desactivada
- 🔴 **Error**: Problema en evaluación (KPI no disponible)

**Crear Nueva Alerta**:
Formulario: 
1. **Información Básica**:
   - Nombre de la alerta*
   - Descripción
   - Prioridad (alta, media, baja)

2. **Configuración de Condición**: 
   - Seleccionar KPI a monitorear (dropdown con todos los KPIs disponibles)
   - Operador:  >, <, =, >=, <=, entre, fuera de rango
   - Valor umbral (número o rango)
   - Ejemplo visual de cuándo se dispararía

3. **Frecuencia de Evaluación**:
   - En tiempo real (cada vez que el KPI se actualiza)
   - Cada hora
   - Diaria (hora específica)
   - Semanal
   - Mensual

4. **Acciones al Dispararse**:
   - Enviar email a: 
     - Usuarios específicos (multi-select)
     - Roles (managers, admins, etc.)
     - Emails externos
   - Notificación in-app
   - Webhook a URL externa
   - Crear ticket en Soporte (opcional)

5. **Configuración Avanzada**:
   - Re-notificar cada X horas (evitar spam)
   - Auto-resolver si vuelve a rango normal
   - Incluir gráfico del KPI en notificación
   - Adjuntar informe relacionado

6. **Silenciar Temporalmente**:
   - Durante horarios no laborables
   - Durante periodos específicos (vacaciones, mantenimiento)

**Historial de Activaciones**:
Por cada alerta configurada: 
- Tabla con activaciones pasadas
- Fecha y hora de disparo
- Valor del KPI en ese momento
- Usuarios notificados
- Tiempo hasta resolución
- Acciones tomadas (si se registraron)

**Panel de Alertas Activas** (Vista Resumida):
- Lista de alertas disparadas actualmente
- Ordenadas por prioridad
- Información rápida: 
  - Nombre de alerta
  - KPI afectado
  - Valor actual vs esperado
  - Tiempo desde activación
  - Acciones: 
    - Ver detalle
    - Silenciar por X horas
    - Marcar como resuelta
    - Ir a dashboard relacionado

**Plantillas de Alertas**: 
Alertas predefinidas del sistema:
- SLA de soporte < 80%
- Tickets sin asignar > 10
- Rotación de empleados > 5% mensual
- Inventario de producto X < stock mínimo
- Proyectos retrasados > 3
- Instancias BPM vencidas > 5

**Permisos**: 
- `bi.view_alerts` - Ver alertas
- `bi.create_alerts` - Crear alertas
- `bi.manage_alerts` - Editar/eliminar alertas
- `bi.configure_webhooks` - Configurar webhooks

---

### 8. Dashboard de BI (`BIDashboard.jsx`)

#### Funcionalidad Completa

**Propósito**: Vista de administración y monitorización del propio módulo BI.

**Características**: 

**KPIs del Módulo BI**:
- Total de informes disponibles
- Informes ejecutados hoy
- Datasets activos
- Alertas disparadas (activas)
- Usuarios activos en BI
- Espacio utilizado por exportaciones

**Gráficos de Uso**:
1. **Informes Más Ejecutados** (Bar Chart)
   - Top 10 informes por número de ejecuciones
   - Últimos 30 días

2. **Actividad por Usuario** (Line Chart)
   - Número de ejecuciones por día
   - Por usuario o agregado

3. **Datasets por Estado** (Donut Chart)
   - Activos
   - Pausados
   - Con errores

4. **Tiempo de Procesamiento** (Area Chart)
   - Evolución del tiempo promedio de ejecución de informes
   - Últimos 7 días

**Tabla de Rendimiento**:
- Informes más lentos (tiempo de ejecución)
- Datasets que requieren optimización
- Consultas que consumen más recursos

**Alertas y Recomendaciones**:
- Datasets sin refrescar hace más de X días
- Informes programados que fallan recurrentemente
- Usuarios con acceso a datos sensibles
- Espacio de almacenamiento próximo al límite

**Acciones de Administración**:
- Limpiar exportaciones antiguas
- Optimizar datasets pesados
- Revisar permisos de acceso
- Exportar configuración completa de BI

**Permisos**:
- `bi.admin` - Administración completa del módulo BI

---

## 🎨 Componentes Compartidos del Módulo

### Componentes Reutilizables Internos

**1. KPICard** - Tarjeta de métrica con valor, tendencia y sparkline

**2. ChartContainer** - Wrapper para gráficos con exportación y fullscreen

**3. DataTable** - Tabla dinámica con ordenación, filtrado y paginación

**4. FilterPanel** - Panel de filtros reutilizable con date pickers y selects

**5. ExportButton** - Botón con dropdown de formatos de exportación

**6. TrendIndicator** - Indicador de tendencia (↑↓) con porcentaje y color

**7. DateRangePicker** - Selector de rangos de fechas con presets

**8. ReportCard** - Card de informe con acciones rápidas

**9. DatasetStatusBadge** - Badge de estado de dataset

**10. AlertPriorityBadge** - Badge de prioridad de alerta

---

## 🔐 Control de Acceso y Permisos

### Matriz de Permisos del Módulo BI

| Permiso | Descripción | Rol con Acceso |
|---------|-------------|----------------|
| `bi.view_dashboard` | Ver dashboard global | Todos (según empresa) |
| `bi.view_module_dashboard` | Ver dashboards de módulos | Todos |
| `bi.view_reports` | Ver catálogo de informes | Todos |
| `bi.execute_reports` | Ejecutar informes | Todos |
| `bi.create_reports` | Crear informes personalizados | Analistas, Admins |
| `bi.edit_reports` | Editar informes propios | Creadores |
| `bi.edit_all_reports` | Editar cualquier informe | Admins |
| `bi.export_reports` | Exportar informes | Todos |
| `bi.share_reports` | Compartir informes | Todos |
| `bi.schedule_reports` | Programar ejecuciones | Analistas, Admins |
| `bi.view_datasets` | Ver datasets | Analistas, Admins |
| `bi.create_datasets` | Crear datasets | Admins |
| `bi.refresh_datasets` | Refrescar datasets | Analistas, Admins |
| `bi.view_alerts` | Ver alertas | Managers, Admins |
| `bi.create_alerts` | Crear alertas | Managers, Admins |
| `bi.sql_access` | Consultas SQL personalizadas | Administradores BI |
| `bi.admin` | Administración completa | Administradores BI |

---

## 📊 Flujos de Datos Principales

### 1. Flujo de Visualización de Dashboard
```
Usuario accede → DashboardView → biService. getDashboardMetrics()
    ↓
Backend consulta datasets pre-agregados → Devuelve KPIs
    ↓
Frontend renderiza widgets → Usuario aplica filtros → Re-consulta con filtros
```

### 2. Flujo de Ejecución de Informe
```
Usuario selecciona informe → ReportViewer → Establece parámetros
    ↓
Click "Ejecutar" → biService.executeReport() → Backend procesa
    ↓
Resultado devuelto → Renderizado (tabla/gráfico) → Opción de exportar
```

### 3. Flujo de Alerta
```
Sistema evalúa KPI (según frecuencia) → Compara con umbral
    ↓
Si se cumple condición → Dispara alerta → Notifica destinatarios
    ↓
Registra en historial → Actualiza panel de alertas activas
```

---

## 🔄 Sincronización y Actualización de Datos

**Estrategias**:
- **Datasets**: Refrescos programados según configuración (cada hora, diario, etc.)
- **Dashboard**: Auto-refresh cada 60 segundos (configurable)
- **Informes**: Bajo demanda o programados
- **Alertas**: Evaluación en tiempo real o periódica según configuración
- **Caché**: KPIs pre-agregados para mejorar rendimiento

---

Este documento proporciona una visión técnica completa del módulo BI en el frontend, asegurando coherencia con el backend y facilitando la toma de decisiones basada en datos. 