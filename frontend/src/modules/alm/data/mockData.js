import { PROJECT_STATUS } from '../constants/projectStatus';
import { TASK_STATUS } from '../constants/taskStatus';
import { TASK_PRIORITY } from '../constants/taskPriority';

// Mock Projects
export const mockProjects = [
  {
    id: 1,
    nombre: 'Rediseño Web Corporativa',
    descripcion: 'Actualización completa del sitio web corporativo con nueva identidad visual',
    fechaInicio: '2026-01-15',
    fechaFin: '2026-04-30',
    estado: PROJECT_STATUS.IN_PROGRESS,
    responsableId: 1,
    responsableNombre: 'Ana García',
    clienteId: 1,
    clienteNombre: 'Tech Solutions SA',
    presupuesto: 45000,
    horasEstimadas: 480,
    horasTrabajadas: 156,
    progreso: 35,
    tareasCompletadas: 12,
    tareasTotales: 34
  },
  {
    id: 2,
    nombre: 'App Móvil E-commerce',
    descripcion: 'Desarrollo de aplicación móvil para gestión de ventas online',
    fechaInicio: '2025-11-01',
    fechaFin: '2026-03-15',
    estado: PROJECT_STATUS.IN_PROGRESS,
    responsableId: 2,
    responsableNombre: 'Carlos Ruiz',
    clienteId: 2,
    clienteNombre: 'Digital Commerce SL',
    presupuesto: 78000,
    horasEstimadas: 720,
    horasTrabajadas: 520,
    progreso: 72,
    tareasCompletadas: 45,
    tareasTotales: 62
  },
  {
    id: 3,
    nombre: 'Migración a Cloud',
    descripcion: 'Migración de infraestructura local a servicios cloud (AWS)',
    fechaInicio: '2026-02-01',
    fechaFin: '2026-06-30',
    estado: PROJECT_STATUS.PLANNING,
    responsableId: 1,
    responsableNombre: 'Ana García',
    clienteId: 3,
    clienteNombre: 'Innovate Corp',
    presupuesto: 95000,
    horasEstimadas: 960,
    horasTrabajadas: 0,
    progreso: 0,
    tareasCompletadas: 0,
    tareasTotales: 48
  },
  {
    id: 4,
    nombre: 'Sistema de Gestión Interna',
    descripcion: 'ERP personalizado para gestión de recursos y proyectos',
    fechaInicio: '2025-09-01',
    fechaFin: '2025-12-31',
    estado: PROJECT_STATUS.COMPLETED,
    responsableId: 3,
    responsableNombre: 'María López',
    clienteId: 1,
    clienteNombre: 'Tech Solutions SA',
    presupuesto: 120000,
    horasEstimadas: 1200,
    horasTrabajadas: 1150,
    progreso: 100,
    tareasCompletadas: 85,
    tareasTotales: 85
  },
  {
    id: 5,
    nombre: 'Integración APIs Bancarias',
    descripcion: 'Integración con APIs de bancos para pagos automatizados',
    fechaInicio: '2026-01-10',
    fechaFin: '2026-02-28',
    estado: PROJECT_STATUS.PAUSED,
    responsableId: 2,
    responsableNombre: 'Carlos Ruiz',
    clienteId: 2,
    clienteNombre: 'Digital Commerce SL',
    presupuesto: 35000,
    horasEstimadas: 320,
    horasTrabajadas: 145,
    progreso: 45,
    tareasCompletadas: 8,
    tareasTotales: 18
  }
];

// Mock Tasks
export const mockTasks = [
  {
    id: 1,
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    nombre: 'Diseño de wireframes',
    descripcion: 'Crear wireframes para todas las páginas principales',
    estado: TASK_STATUS.COMPLETED,
    prioridad: TASK_PRIORITY.HIGH,
    asignadoA: 1,
    asignadoNombre: 'Ana García',
    horasEstimadas: 24,
    horasTrabajadas: 22,
    fechaCreacion: '2026-01-15',
    fechaVencimiento: '2026-01-25'
  },
  {
    id: 2,
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    nombre: 'Implementar diseño responsive',
    descripcion: 'Maquetar el diseño con CSS Grid y Flexbox',
    estado: TASK_STATUS.IN_PROGRESS,
    prioridad: TASK_PRIORITY.HIGH,
    asignadoA: 2,
    asignadoNombre: 'Carlos Ruiz',
    horasEstimadas: 40,
    horasTrabajadas: 28,
    fechaCreacion: '2026-01-20',
    fechaVencimiento: '2026-02-10'
  },
  {
    id: 3,
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    nombre: 'Integrar CMS',
    descripcion: 'Conectar frontend con sistema de gestión de contenidos',
    estado: TASK_STATUS.TODO,
    prioridad: TASK_PRIORITY.MEDIUM,
    asignadoA: 3,
    asignadoNombre: 'María López',
    horasEstimadas: 32,
    horasTrabajadas: 0,
    fechaCreacion: '2026-01-22',
    fechaVencimiento: '2026-02-20'
  },
  {
    id: 4,
    proyectoId: 2,
    proyectoNombre: 'App Móvil E-commerce',
    nombre: 'Pantalla de login',
    descripcion: 'Desarrollar pantalla de autenticación con OAuth',
    estado: TASK_STATUS.COMPLETED,
    prioridad: TASK_PRIORITY.CRITICAL,
    asignadoA: 2,
    asignadoNombre: 'Carlos Ruiz',
    horasEstimadas: 16,
    horasTrabajadas: 18,
    fechaCreacion: '2025-11-05',
    fechaVencimiento: '2025-11-15'
  },
  {
    id: 5,
    proyectoId: 2,
    proyectoNombre: 'App Móvil E-commerce',
    nombre: 'Catálogo de productos',
    descripcion: 'Listado de productos con filtros y búsqueda',
    estado: TASK_STATUS.IN_REVIEW,
    prioridad: TASK_PRIORITY.HIGH,
    asignadoA: 1,
    asignadoNombre: 'Ana García',
    horasEstimadas: 48,
    horasTrabajadas: 45,
    fechaCreacion: '2025-11-20',
    fechaVencimiento: '2025-12-15'
  },
  {
    id: 6,
    proyectoId: 2,
    proyectoNombre: 'App Móvil E-commerce',
    nombre: 'Pasarela de pago',
    descripcion: 'Integración con Stripe y PayPal',
    estado: TASK_STATUS.IN_PROGRESS,
    prioridad: TASK_PRIORITY.CRITICAL,
    asignadoA: 2,
    asignadoNombre: 'Carlos Ruiz',
    horasEstimadas: 56,
    horasTrabajadas: 35,
    fechaCreacion: '2025-12-01',
    fechaVencimiento: '2026-01-10'
  },
  {
    id: 7,
    proyectoId: 3,
    proyectoNombre: 'Migración a Cloud',
    nombre: 'Análisis de infraestructura actual',
    descripcion: 'Documentar servicios y dependencias actuales',
    estado: TASK_STATUS.TODO,
    prioridad: TASK_PRIORITY.HIGH,
    asignadoA: 1,
    asignadoNombre: 'Ana García',
    horasEstimadas: 24,
    horasTrabajadas: 0,
    fechaCreacion: '2026-02-01',
    fechaVencimiento: '2026-02-10'
  }
];

// Mock Time Entries
export const mockTimeEntries = [
  {
    id: 1,
    tareaId: 1,
    tareaNombre: 'Diseño de wireframes',
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    usuarioId: 1,
    usuarioNombre: 'Ana García',
    fecha: '2026-01-16',
    horas: 8,
    descripcion: 'Diseño de wireframes para home, about y servicios'
  },
  {
    id: 2,
    tareaId: 1,
    tareaNombre: 'Diseño de wireframes',
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    usuarioId: 1,
    usuarioNombre: 'Ana García',
    fecha: '2026-01-17',
    horas: 7,
    descripcion: 'Wireframes para blog y contacto'
  },
  {
    id: 3,
    tareaId: 1,
    tareaNombre: 'Diseño de wireframes',
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    usuarioId: 1,
    usuarioNombre: 'Ana García',
    fecha: '2026-01-18',
    horas: 7,
    descripcion: 'Revisión y ajustes finales de wireframes'
  },
  {
    id: 4,
    tareaId: 2,
    tareaNombre: 'Implementar diseño responsive',
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    usuarioId: 2,
    usuarioNombre: 'Carlos Ruiz',
    fecha: '2026-01-22',
    horas: 8,
    descripcion: 'Setup inicial y estructura base HTML/CSS'
  },
  {
    id: 5,
    tareaId: 2,
    tareaNombre: 'Implementar diseño responsive',
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    usuarioId: 2,
    usuarioNombre: 'Carlos Ruiz',
    fecha: '2026-01-23',
    horas: 8,
    descripcion: 'Implementación de Grid layout para home'
  },
  {
    id: 6,
    tareaId: 2,
    tareaNombre: 'Implementar diseño responsive',
    proyectoId: 1,
    proyectoNombre: 'Rediseño Web Corporativa',
    usuarioId: 2,
    usuarioNombre: 'Carlos Ruiz',
    fecha: '2026-01-24',
    horas: 6,
    descripcion: 'Responsive para tablets y móviles'
  }
];

// Mock Dashboard Stats
export const mockALMStats = {
  proyectosActivos: 3,
  proyectosEnPlanificacion: 1,
  proyectosCompletados: 1,
  tareasPendientes: 28,
  tareasEnProgreso: 15,
  tareasCompletadas: 65,
  horasTrabajadas: 821,
  horasEstimadas: 3680,
  eficienciaPromedio: 96
};
