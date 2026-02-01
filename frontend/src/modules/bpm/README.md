# Módulo BPM - Frontend

## 📋 Descripción

Módulo completo de **Business Process Management (BPM)** para el sistema VMRC-EC. Proporciona una interfaz moderna y responsive para gestionar procesos, instancias, tareas y documentos.

## 🏗️ Estructura del Módulo

```
src/modules/bpm/
├── components/               # Componentes reutilizables
│   ├── processes/           # Componentes de procesos
│   ├── tasks/               # Componentes de tareas
│   ├── instances/           # Componentes de instancias
│   ├── forms/               # Componentes de formularios
│   ├── documents/           # Componentes de documentos
│   ├── designer/            # Componentes del editor BPMN
│   └── shared/              # Componentes compartidos
├── pages/                   # Páginas principales
├── hooks/                   # Custom hooks
├── context/                 # Context API
├── services/                # Llamadas a API
├── constants/               # Constantes globales
├── utils/                   # Funciones utilitarias
└── index.js                 # Exportaciones del módulo
```

## 🎯 Características Principales

### 1. **Gestión de Procesos**
- Listar procesos publicados
- Crear, editar y publicar procesos
- Validación de procesos
- Control de versiones
- Búsqueda y filtrado avanzado

### 2. **Monitoreo de Instancias**
- Dashboard de instancias activas
- Visualización de progreso
- Timeline de actividades
- Control SLA en tiempo real
- Pausar/Reanudar/Cancelar instancias

### 3. **Gestión de Tareas**
- Bandeja de tareas personal
- Filtrado por estado/prioridad
- Asignación de tareas
- Transferencia de tareas
- Indicador de vencimiento

### 4. **Formularios Dinámicos**
- Constructor de formularios desde JSON
- Validación automática
- Campos de múltiples tipos
- Visibilidad condicional
- Integración con procesos

### 5. **Gestión de Documentos**
- Carga de archivos con drag & drop
- Validación de tipos y tamaños
- Descarga y eliminación
- Adjuntos a instancias

### 6. **Editor de Procesos**
- Visualizador BPMN
- Edición visual de diagramas
- Elementos BPMN estándar
- Exportación e importación

## 📦 Componentes

### Componentes Compartidos (shared/)
- **SLAProgressBar**: Barra visual de progreso SLA
- **ActivityTimeline**: Timeline de actividades
- **UserPicker**: Selector de usuarios
- **CommentThread**: Hilo de comentarios
- **DateRangePicker**: Selector de rango de fechas

### Componentes de Procesos (processes/)
- **ProcessCard**: Tarjeta de proceso
- **ProcessTable**: Tabla de procesos
- **ProcessFilters**: Filtros de procesos

### Componentes de Tareas (tasks/)
- **TaskCard**: Tarjeta de tarea
- **TaskTable**: Tabla de tareas

### Componentes de Instancias (instances/)
- **InstanceCard**: Tarjeta de instancia
- **InstanceTable**: Tabla de instancias

### Componentes de Formularios (forms/)
- **DynamicFormBuilder**: Constructor dinámico
- **FormField**: Campo individual
- **FormValidation**: Validación visual

### Componentes de Documentos (documents/)
- **DocumentUploader**: Cargador de archivos
- **DocumentList**: Lista de documentos

### Componentes del Designer (designer/)
- **BPMNViewer**: Visualizador de diagramas BPMN

## 🎨 Páginas Principales

| Página | Ruta | Descripción |
|--------|------|-------------|
| **BPMDashboard** | `/bpm` | Dashboard con estadísticas generales |
| **ProcessList** | `/bpm/procesos` | Listado y gestión de procesos |
| **ProcessDesigner** | `/bpm/procesos/:id/diseñar` | Editor visual de procesos |
| **ProcessStartForm** | `/bpm/procesos/:id/iniciar` | Formulario para iniciar proceso |
| **TaskInbox** | `/bpm/tareas` | Bandeja de tareas personal |
| **InstanceMonitor** | `/bpm/instancias/:id` | Monitor de instancia |

## 🔧 Hooks Disponibles

### useProcesses()
Gestión de lista de procesos
```javascript
const { processes, loading, filters, setFilters } = useProcesses();
```

### useProcess(id)
Gestión de proceso individual
```javascript
const { process, loading, validate, publish } = useProcess(processId);
```

### useInstances()
Gestión de lista de instancias
```javascript
const { instances, loading, startInstance, cancelInstance } = useInstances();
```

### useInstance(id)
Gestión de instancia individual
```javascript
const { instance, timeline, pause, resume } = useInstance(instanceId);
```

### useTasks()
Gestión de tareas
```javascript
const { tasks, loading, filters, setFilters } = useTasks();
```

### useTaskInbox()
Bandeja de tareas con estadísticas
```javascript
const { tasks, stats, loading } = useTaskInbox();
```

### useDocuments()
Gestión de documentos
```javascript
const { upload, download, delete: deleteDoc } = useDocuments();
```

### useBPMMetrics()
Métricas y KPIs del BPM
```javascript
const { metrics, loading } = useBPMMetrics();
```

### useBPMNEditor()
Editor BPMN con undo/redo
```javascript
const { model, undo, redo, save } = useBPMNEditor(processId);
```

## 🎨 Constantes

### PROCESS_STATUS
- DRAFT: Borrador
- PUBLISHED: Publicado
- ARCHIVED: Archivado
- DEPRECATED: Deprecated

### INSTANCE_STATUS
- PENDING: Pendiente
- ACTIVE: Activa
- PAUSED: Pausada
- COMPLETED: Completada
- CANCELLED: Cancelada
- ERROR: Error

### TASK_STATUS
- PENDING: Pendiente
- ASSIGNED: Asignada
- IN_PROGRESS: En progreso
- COMPLETED: Completada
- CANCELLED: Cancelada

### TASK_PRIORITY
- LOW: Baja (1)
- NORMAL: Normal (2)
- HIGH: Alta (3)
- URGENT: Urgente (4)
- CRITICAL: Crítica (5)

## 🔌 API Endpoints (bpmService)

### Procesos
- `GET /api/bpm/procesos` - Listar procesos
- `GET /api/bpm/procesos/:id` - Obtener proceso
- `POST /api/bpm/procesos` - Crear proceso
- `PUT /api/bpm/procesos/:id` - Actualizar proceso
- `POST /api/bpm/procesos/:id/publicar` - Publicar proceso
- `POST /api/bpm/procesos/:id/validar` - Validar proceso

### Instancias
- `GET /api/bpm/instancias` - Listar instancias
- `GET /api/bpm/instancias/:id` - Obtener instancia
- `POST /api/bpm/instancias` - Iniciar instancia
- `POST /api/bpm/instancias/:id/pausar` - Pausar instancia
- `POST /api/bpm/instancias/:id/reanudar` - Reanudar instancia
- `POST /api/bpm/instancias/:id/cancelar` - Cancelar instancia

### Tareas
- `GET /api/bpm/tareas` - Listar tareas
- `GET /api/bpm/tareas/bandeja` - Bandeja de tareas
- `GET /api/bpm/tareas/:id` - Obtener tarea
- `POST /api/bpm/tareas/:id/completar` - Completar tarea
- `POST /api/bpm/tareas/:id/transferir` - Transferir tarea

### Documentos
- `POST /api/bpm/documentos` - Cargar documento
- `GET /api/bpm/instancias/:id/documentos` - Listar documentos
- `GET /api/bpm/documentos/:id/descargar` - Descargar documento
- `DELETE /api/bpm/documentos/:id` - Eliminar documento

## 🎨 Paleta de Colores

### Fondos
- Primary: `#3b82f6` (Azul)
- Secondary: `#10b981` (Verde)
- Danger: `#ef4444` (Rojo)
- Warning: `#f59e0b` (Naranja)

### Grises Neutrales
- `#1f2937` (Texto principal)
- `#374151` (Texto secundario)
- `#6b7280` (Texto terciario)
- `#9ca3af` (Placeholder)
- `#d1d5db` (Bordes)
- `#e5e7eb` (Fondo claro)
- `#f3f4f6` (Fondo más claro)
- `#f9fafb` (Fondo muy claro)

## 📱 Responsividad

Todos los componentes utilizan Grid CSS y flexbox para asegurar responsividad:
- **Desktop**: Layouts completos con múltiples columnas
- **Tablet**: 2-3 columnas, controles adaptados
- **Mobile**: Una columna, controles táctiles

## ✅ Validaciones

### Emails
```javascript
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Teléfono
```javascript
/^[\+]?[\d\s\-\(\)]{7,}$/
```

### URLs
```javascript
/^https?:\/\/.+/
```

### Rangos
```javascript
value >= min && value <= max
```

## 🚀 Uso

### Importar componentes
```javascript
import {
  BPMDashboard,
  ProcessList,
  ProcessCard,
  TaskInbox,
  DynamicFormBuilder
} from '@/modules/bpm';
```

### Importar hooks
```javascript
import {
  useProcesses,
  useInstances,
  useTasks,
  useBPMMetrics
} from '@/modules/bpm';
```

### Usar BPMProvider
```javascript
import { BPMProvider } from '@/modules/bpm';

function App() {
  return (
    <BPMProvider>
      <YourComponent />
    </BPMProvider>
  );
}
```

## 📊 Estadísticas del Módulo

- **Páginas**: 6
- **Componentes**: 21
- **Hooks**: 10
- **Servicios**: 1 (con 23 endpoints)
- **Constantes**: 6
- **Utilidades**: 8
- **Archivos totales**: 80+
- **Líneas de código**: ~8,000+

## 🔄 Commits

### Fase 1: Infraestructura
- Constantes, servicios, hooks, context, componentes base

### Fase 2: Componentes y Páginas
- Páginas principales (Dashboard, ProcessList, TaskInbox)
- Componentes de tareas e instancias
- Componentes de formularios
- Componentes de documentos

### Fase 3: Finalización
- Página InstanceMonitor
- Página ProcessDesigner
- Componente BPMNViewer
- Exportaciones completas

## 📝 Notas de Desarrollo

### Próximas Mejoras
- Integración con bpmn-js para editor visual completo
- WebSockets para actualización en tiempo real
- Exportación a PDF
- Historial de cambios
- Notificaciones en tiempo real

### Dependencias Recomendadas
- `bpmn-js`: Editor BPMN visual
- `react-query`: Cache y sincronización de datos
- `zustand`: Estado global opcional
- `chart.js`: Gráficos para dashboard
- `date-fns`: Utilidades de fechas

## 👥 Roles y Permisos

- **Administrador**: Crear, editar, publicar procesos
- **Gestor de Procesos**: Diseñar y publicar
- **Usuario**: Iniciar procesos, completar tareas
- **Supervisor**: Monitorear instancias
- **Analista**: Ver reportes y métricas

## 📞 Soporte

Para dudas o reportar issues del módulo BPM, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Estado**: ✅ Producción
