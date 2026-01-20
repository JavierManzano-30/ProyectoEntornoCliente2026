# Módulo Soporte — Información

## 1. Finalidad
El módulo Soporte gestiona incidencias y peticiones de los usuarios (tickets), centralizando la comunicación entre usuarios y el equipo de soporte. Su objetivo es registrar, priorizar, resolver y auditar las solicitudes, además de proporcionar métricas para seguimiento y mejora continua.

## 2. Alcance
- Gestión completa del ciclo de vida de un ticket: creación, asignación, respuestas, escalado, resolución y cierre.
- Conversaciones (mensajes/comentarios) y adjuntos por ticket.
- Priorización, categorización y seguimiento de SLA.
- Integración con otros módulos (Core, ALM, BI, Notificaciones).

## 3. Usuarios que lo utilizan
- Usuarios finales / clientes (crean tickets, añaden información y siguen la conversación).
- Soporte técnico N1 / N2 (gestionan, responden y resuelven tickets).
- Coordinadores/gestores (asignación y escalado).
- Administradores (configuración, métricas y reports).
- BI / analistas (consumo de métricas consolidadas).

## 4. Datos que gestiona
Basado en el modelo provisional de BBDD:
- Tickets:
  - id, empresa_id, titulo, descripcion, categoria (tecnico | facturacion | otro), prioridad (baja | media | alta | urgente), estado (abierto | en_progreso | resuelto | cerrado), creador_id, asignado_a, created_at, updated_at
- Comentarios/Mensajes:
  - id, ticket_id, usuario_id, comentario, created_at
- Adjuntos/archivos asociados al ticket
- Historial de cambios (auditoría, asignaciones, transiciones de estado)
- Metadatos de SLA y tiempos de respuesta

## 5. Integraciones y relaciones claves
- CORE: usuarios, empresas y permisos.
- ALM: posibilidad de convertir/incorporar un ticket a una tarea/proyecto.
- BI: consumo de métricas (tiempos medios, tickets abiertos, SLA incumplidos).
- Notificaciones/Email: alertas para asignaciones, respuestas y escalados.
- Autenticación y control de acceso multiempresa.

## 6. Requisitos no funcionales y restricciones
- Soporte multiempresa y segregación de datos por empresa.
- Control de acceso por roles/permiso para ver/editar tickets.
- Trazabilidad: registro de todas las acciones relevantes.
- Escalabilidad para soportar volúmenes de conversaciones y adjuntos.
- Política de retención y protección de datos personales (GDPR / privacidad según requerimientos).

## 7. Problemas que resuelve
- Centraliza la gestión de incidencias para reducir tiempos de resolución.
- Proporciona histórico de conversaciones y decisiones.
- Facilita la trazabilidad y el reporting para la mejora continua y cumplimiento de SLA.
