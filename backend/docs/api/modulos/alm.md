# API - ALM

Este documento aplica las convenciones de `docs/api/convenciones-api.md` al modulo ALM.

## 1. URI y versionado
- Base URL: `/api/v1`
- Recursos en plural, `kebab-case` si aplica (preferir una sola palabra).
- Anidamiento maximo de 1 nivel.

## 2. Formato de respuesta (Envelope)

Respuesta exitosa:
```json
{
  "success": true,
  "data": { },
  "meta": { }
}
```

Respuesta de error:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "El recurso con ID 55 no existe.",
    "details": []
  }
}
```

## 3. Metodos HTTP
- `GET`: leer recursos.
- `POST`: crear recursos.
- `PUT`: reemplazar un recurso completo.
- `PATCH`: modificacion parcial.
- `DELETE`: eliminar recursos.

## 4. Codigos de estado
- `200 OK` (GET, PUT, PATCH)
- `201 Created` (POST)
- `204 No Content` (DELETE)
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `500 Internal Server Error`

## 5. Autenticacion y seguridad
- JWT en `Authorization: Bearer <token_jwt>`
- CORS restringido en produccion.

## 6. Paginacion
- `page` (empieza en 1)
- `limit` (defecto 10, max 100)

Meta de paginacion:
```json
{
  "page": 1,
  "limit": 10,
  "totalItems": 150,
  "totalPages": 15
}
```

## 7. Naming conventions (JSON)
- Propiedades en `camelCase`.
- Fechas en ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`).

---

## Endpoints - ALM

Notas de esquema (syneraDb.sql):
- Tablas ALM: `alm_projects`, `alm_tasks`, `alm_time_entries`.
- IDs en ALM son `TEXT` (no UUID) y se generan en la API.

### Proyectos
- `GET /alm/proyectos`
- `POST /alm/proyectos`
- `GET /alm/proyectos/{id}`
- `PUT /alm/proyectos/{id}`
- `DELETE /alm/proyectos/{id}`
- `GET /alm/proyectos/{id}/tareas`
- `GET /alm/proyectos/{id}/estadisticas`

Filtros y paginacion (listas):
- `page`, `limit`, `sort`
- `companyId`, `status`, `clientId`, `responsibleId`, `startDate`, `endDate`

Ejemplo request (POST):
```json
{
  "companyId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
  "name": "Proyecto Atlas",
  "description": "Migracion de CRM",
  "startDate": "2026-01-10",
  "endDate": "2026-03-30",
  "responsibleId": "usr_10",
  "status": "planned",
  "budget": 25000,
  "clientId": "cli_5"
}
```

Ejemplo response (POST):
```json
{
  "success": true,
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "companyId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
    "name": "Proyecto Atlas",
    "description": "Migracion de CRM",
    "startDate": "2026-01-10",
    "endDate": "2026-03-30",
    "responsibleId": "usr_10",
    "status": "planned",
    "budget": 25000,
    "clientId": "cli_5",
    "createdAt": "2026-01-10T09:00:00Z",
    "updatedAt": "2026-01-10T09:00:00Z"
  }
}
```

### Tareas
- `GET /alm/tareas`
- `POST /alm/tareas`
- `GET /alm/tareas/{id}`
- `PUT /alm/tareas/{id}`
- `DELETE /alm/tareas/{id}`
- `PATCH /alm/tareas/{id}/estado`
- `PATCH /alm/tareas/{id}/asignar`

Filtros y paginacion (listas):
- `page`, `limit`, `sort`
- `companyId`, `status`, `priority`, `projectId`, `assignedTo`, `dueDate`

Ejemplo request (POST):
```json
{
  "companyId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
  "projectId": "proj_100",
  "title": "Diseno de entidades",
  "description": "Definir tablas y relaciones",
  "status": "pending",
  "priority": "medium",
  "assignedTo": "usr_10",
  "dueDate": "2026-01-31",
  "estimatedTime": 16
}
```

Ejemplo response (POST):
```json
{
  "success": true,
  "data": {
    "id": "7b9d6a1e-9f2c-4c1a-8d7f-3a1b2c9d0e11",
    "companyId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
    "projectId": "proj_100",
    "title": "Diseno de entidades",
    "description": "Definir tablas y relaciones",
    "status": "pending",
    "priority": "medium",
    "assignedTo": "usr_10",
    "dueDate": "2026-01-31",
    "estimatedTime": 16,
    "createdAt": "2026-01-12T10:00:00Z",
    "updatedAt": "2026-01-12T10:00:00Z"
  }
}

### Tiempos
- `GET /alm/tiempos`
- `POST /alm/tiempos`
- `PUT /alm/tiempos/{id}`
- `DELETE /alm/tiempos/{id}`
- `GET /alm/tiempos/proyecto/{id}/resumen`
- `GET /alm/tiempos/usuario/{id}`
- `GET /alm/tiempos/tarea/{id}`

Filtros y paginacion (listas):
- `page`, `limit`
- `companyId`, `taskId`, `userId`, `entryDate`

Ejemplo request (POST):
```json
{
  "companyId": "7f1b9b7a-3a4a-4f1b-9b6a-7f6c2b9e1f10",
  "taskId": "task_900",
  "userId": "usr_10",
  "entryDate": "2026-01-15",
  "hours": 3.5,
  "description": "Reunion + avance"
}
```

## Enums
- `project.status`: `planned | in_progress | paused | completed`
- `task.status`: `pending | in_progress | completed`
- `task.priority`: `low | medium | high`

## Relaciones clave (para frontend)
- `projects.responsible_id` -> `core_users.id` (CORE)
- `projects.client_id` -> `crm_clients.id` (CRM)
- `tasks.assigned_to` -> `core_users.id` (CORE)
- `tasks.project_id` -> `projects.id`
