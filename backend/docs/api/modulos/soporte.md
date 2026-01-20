# API — Módulo Soporte

Notas:
- Todas las rutas requieren autenticación y respetan aislamiento multiempresa.
- Las rutas indican recursos y operaciones; los payloads y ejemplos no están incluidos aquí (ver especificación API o contrato para detalles).

## Tickets
- GET  /api/v1/tickets
- POST /api/v1/tickets
- GET  /api/v1/tickets/{ticketId}
- PATCH /api/v1/tickets/{ticketId}
- DELETE /api/v1/tickets/{ticketId} (administración / solo lógica según política)
- GET  /api/v1/tickets/{ticketId}/timeline

## Mensajes / Conversación
- GET  /api/v1/tickets/{ticketId}/messages
- POST /api/v1/tickets/{ticketId}/messages
- PATCH /api/v1/tickets/{ticketId}/messages/{messageId}
- DELETE /api/v1/tickets/{ticketId}/messages/{messageId}

## Acciones específicas
- PATCH /api/v1/tickets/{ticketId}/assign       (asignar/reasignar agente)
- PATCH /api/v1/tickets/{ticketId}/close        (cerrar ticket)
- PATCH /api/v1/tickets/{ticketId}/reopen       (reabrir ticket)
- POST  /api/v1/tickets/{ticketId}/escalate     (escalar ticket)
- POST  /api/v1/tickets/{ticketId}/convert      (convertir ticket a tarea en ALM)

## Adjuntos / Archivos
- POST   /api/v1/tickets/{ticketId}/attachments
- GET    /api/v1/tickets/{ticketId}/attachments/{attachmentId}
- DELETE /api/v1/tickets/{ticketId}/attachments/{attachmentId}

## Búsquedas / Filtros / Reportes simples
- GET /api/v1/tickets?status={}&priority={}&assigned_to={}&from={}&to={}
- GET /api/v1/tickets/metrics/summary            (resumen para dashboard)

## Administración / Configuración
- GET  /api/v1/soporte/config                      (categorías, prioridades, SLA)
- PATCH /api/v1/soporte/config

## Observaciones
- Las respuestas deben incluir metadatos de paginación para listados.
- Las acciones que cambian estado registran auditoría (usuario, timestamp, motivo opcional).
- Considerar endpoints de webhook para notificar sistemas externos (ej. cuando se crea o cierra un ticket).
