// Datos de demostración para el módulo de soporte
export const mockTickets = [
  {
    id: 1,
    titulo: 'Error al generar informes mensuales',
    descripcion: 'Los informes mensuales no se generan correctamente desde la última actualización del sistema.',
    estado: 'pendiente',
    prioridad: 'alta',
    categoria: 'error',
    clienteId: 1,
    cliente: {
      id: 1,
      nombre: 'Empresa Tech Solutions S.L.',
    },
    asignadoA: null,
    nivelSLA: 'premium',
    fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
    fechaActualizacion: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    fechaPrimeraRespuesta: null,
    fechaResolucion: null,
  },
  {
    id: 2,
    titulo: 'Consulta sobre integración con API externa',
    descripcion: 'Necesito información sobre cómo integrar nuestra plataforma con la API de facturación.',
    estado: 'en_progreso',
    prioridad: 'media',
    categoria: 'consulta',
    clienteId: 2,
    cliente: {
      id: 2,
      nombre: 'Innovación Digital',
    },
    asignadoA: {
      id: 1,
      nombre: 'Carlos Martínez',
    },
    nivelSLA: 'standard',
    fechaCreacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
    fechaActualizacion: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    fechaPrimeraRespuesta: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    fechaResolucion: null,
  },
  {
    id: 3,
    titulo: 'Sistema lento en horas punta',
    descripcion: 'El sistema se vuelve muy lento entre las 14:00 y 16:00 horas, afectando la productividad del equipo.',
    estado: 'resuelto',
    prioridad: 'critica',
    categoria: 'incidencia',
    clienteId: 3,
    cliente: {
      id: 3,
      nombre: 'Corporación Global',
    },
    asignadoA: {
      id: 2,
      nombre: 'Ana García',
    },
    nivelSLA: 'enterprise',
    fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Hace 3 días
    fechaActualizacion: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    fechaPrimeraRespuesta: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(),
    fechaResolucion: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    titulo: 'Solicitud de nueva funcionalidad de exportación',
    descripcion: 'Sería útil poder exportar los datos en formato Excel además de PDF.',
    estado: 'pendiente',
    prioridad: 'baja',
    categoria: 'mejora',
    clienteId: 1,
    cliente: {
      id: 1,
      nombre: 'Empresa Tech Solutions S.L.',
    },
    asignadoA: {
      id: 3,
      nombre: 'Luis Rodríguez',
    },
    nivelSLA: 'basic',
    fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
    fechaActualizacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    fechaPrimeraRespuesta: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    fechaResolucion: null,
  },
  {
    id: 5,
    titulo: 'No puedo acceder al módulo de facturación',
    descripcion: 'Al intentar acceder al módulo de facturación aparece un error 403.',
    estado: 'esperando_cliente',
    prioridad: 'alta',
    categoria: 'incidencia',
    clienteId: 4,
    cliente: {
      id: 4,
      nombre: 'StartUp Innovators',
    },
    asignadoA: {
      id: 1,
      nombre: 'Carlos Martínez',
    },
    nivelSLA: 'standard',
    fechaCreacion: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // Hace 2 días
    fechaActualizacion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    fechaPrimeraRespuesta: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(),
    fechaResolucion: null,
  },
  {
    id: 6,
    titulo: 'Actualización de datos de contacto',
    descripcion: 'Necesito actualizar los datos de contacto de nuestra empresa en el sistema.',
    estado: 'cerrado',
    prioridad: 'baja',
    categoria: 'peticion',
    clienteId: 2,
    cliente: {
      id: 2,
      nombre: 'Innovación Digital',
    },
    asignadoA: {
      id: 2,
      nombre: 'Ana García',
    },
    nivelSLA: 'standard',
    fechaCreacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Hace 7 días
    fechaActualizacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    fechaPrimeraRespuesta: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    fechaResolucion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockMessages = {
  1: [
    {
      id: 1,
      ticketId: 1,
      contenido: 'Hola, estamos experimentando un problema con la generación de informes. ¿Pueden ayudarnos?',
      tipo: 'publico',
      autor: {
        id: 101,
        nombre: 'Juan Pérez',
        rol: 'Cliente',
      },
      fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      adjuntos: [],
    },
    {
      id: 2,
      ticketId: 1,
      contenido: 'Hemos recibido su ticket. Nuestro equipo técnico está revisando el problema.',
      tipo: 'publico',
      autor: {
        id: 1,
        nombre: 'Sistema',
        rol: 'Automático',
      },
      fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      adjuntos: [],
    },
  ],
  2: [
    {
      id: 3,
      ticketId: 2,
      contenido: '¿Tienen documentación sobre la API de facturación?',
      tipo: 'publico',
      autor: {
        id: 102,
        nombre: 'María López',
        rol: 'Cliente',
      },
      fechaCreacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      adjuntos: [],
    },
    {
      id: 4,
      ticketId: 2,
      contenido: 'Asignando a Carlos para revisión de documentación API',
      tipo: 'interno',
      autor: {
        id: 2,
        nombre: 'Ana García',
        rol: 'Técnico',
      },
      fechaCreacion: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      adjuntos: [],
    },
    {
      id: 5,
      ticketId: 2,
      contenido: 'Hola María, por supuesto. Te envío el enlace a la documentación completa de nuestra API.',
      tipo: 'publico',
      autor: {
        id: 1,
        nombre: 'Carlos Martínez',
        rol: 'Técnico',
      },
      fechaCreacion: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      adjuntos: [
        {
          id: 1,
          nombre: 'API-Documentation.pdf',
          url: '#',
          tamano: 1024000,
        },
      ],
    },
  ],
  3: [
    {
      id: 6,
      ticketId: 3,
      contenido: 'Sistema muy lento, necesitamos solución urgente!',
      tipo: 'publico',
      autor: {
        id: 103,
        nombre: 'Roberto Sánchez',
        rol: 'Cliente',
      },
      fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      adjuntos: [],
    },
    {
      id: 7,
      ticketId: 3,
      contenido: 'Hemos identificado el problema. Era un cuello de botella en la base de datos. Ya está resuelto.',
      tipo: 'publico',
      autor: {
        id: 2,
        nombre: 'Ana García',
        rol: 'Técnico',
      },
      fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      adjuntos: [],
    },
    {
      id: 8,
      ticketId: 3,
      contenido: 'Perfecto! Confirmamos que el sistema ya funciona correctamente. Gracias!',
      tipo: 'publico',
      autor: {
        id: 103,
        nombre: 'Roberto Sánchez',
        rol: 'Cliente',
      },
      fechaCreacion: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      adjuntos: [],
    },
  ],
};

export const mockDashboardData = {
  ticketsRecientes: [
    {
      id: 1,
      titulo: 'Error al generar informes mensuales',
      estado: 'pendiente',
      fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      titulo: 'Consulta sobre integración con API externa',
      estado: 'en_progreso',
      fechaCreacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      titulo: 'No puedo acceder al módulo de facturación',
      estado: 'esperando_cliente',
      fechaCreacion: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      titulo: 'Sistema lento en horas punta',
      estado: 'resuelto',
      fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  actividadEquipo: [
    {
      nombre: 'Carlos Martínez',
      rol: 'Técnico Senior',
      ticketsAsignados: 8,
    },
    {
      nombre: 'Ana García',
      rol: 'Técnico',
      ticketsAsignados: 6,
    },
    {
      nombre: 'Luis Rodríguez',
      rol: 'Técnico Junior',
      ticketsAsignados: 4,
    },
  ],
};

export const mockStats = {
  totalTickets: 6,
  ticketsAbiertos: 3,
  ticketsResueltosHoy: 1,
  ticketsSLARiesgo: 1,
  cumplimientoSLA: 87,
  slaEnTiempo: 5,
  slaEnRiesgo: 1,
  slaIncumplidos: 0,
};
