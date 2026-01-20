# Módulo Soporte — Funcionalidades

## Funcionalidades principales

1. Creación de ticket
   - Crear ticket con título, descripción, categoría, prioridad y adjuntos.
   - Relacionado con empresa y creador (usuario).

2. Listado y filtrado de tickets
   - Paginado y búsqueda por título, estado, prioridad, responsable, categoría, rango de fechas.
   - Filtros por empresa (multiempresa), estado y SLA.

3. Visualización detalle de ticket
   - Muestra datos principales, historial de estado, conversación (mensajes) y adjuntos.
   - Línea temporal (timeline) de cambios.

4. Conversación / Mensajería en ticket
   - Añadir comentarios/mensajes, incluir adjuntos.
   - Responder, marcar como interno/externo (según permisos).

5. Asignación y reasignación
   - Asignar ticket a un agente/rol.
   - Reasignación y registro de auditoría.

6. Gestión de estado (workflow)
   - Transiciones: abrir → en_progreso → resuelto → cerrado.
   - Acciones rápidas: cerrar, reabrir, escalar.

7. Escalado y SLA
   - Definición de niveles de SLA por prioridad/categoría.
   - Alertas y escalados automáticos cuando SLA está en riesgo o incumplida.

8. Conversión a tarea (integración ALM)
   - Crear una tarea en ALM vinculada al ticket (mantener referencia cruzada).

9. Notificaciones
   - Notificación por email / in-app en eventos clave: nuevo ticket, asignación, respuesta, escalado, cierre.

10. Gestión de adjuntos
    - Subida, visualización y eliminación de archivos asociados al ticket.
    - Control de almacenamiento y políticas de retención.

11. Dashboard y métricas
    - Panel con tickets por estado, prioridad, SLA, tiempos medios de resolución.
    - Exportación simple de listados (CSV/Excel).

12. Permisos y auditoría
    - Acceso basado en roles (ver, comentar, asignar, cerrar).
    - Registro de cambios y usuarios que realizan acciones críticas.

## Relaciones clave (modelo lógico)
- Ticket → Usuario (creador)
- Ticket → Usuario (asignado)
- Ticket → Empresa (empresa propietaria del ticket)
- Ticket → Comentarios (mensajes)
- Ticket → Adjuntos
- Ticket ↔ ALM.Tarea (posible conversión/relación)
- Tickets → BI (exposición de métricas)

## Reglas de negocio importantes
- Solo usuarios con permiso pueden reasignar o cerrar tickets.
- Cambios de estado deben registrar usuario y timestamp.
- Al convertir a tarea, conservar enlace al ticket y viceversa.
- Restricción: un ticket cerrado puede reabrirse con motivo registrado.

## Notas UX
- Formularios guiados para facilitar la captura de datos críticos (categoría y prioridad).
- Vista de hilo conversacional con filtros (solo internos, solo externos).
- Acciones rápidas desde listado (asignar, responder, cerrar).
