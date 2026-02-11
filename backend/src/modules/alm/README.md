# ALM Backend - Guía rápida para Frontend

Este documento resume qué endpoints existen en el backend ALM y cómo consumirlos.

Base URL: `/api/v1/alm`  
Auth: `Authorization: Bearer <token>`

Notas de esquema (syneraDb.sql):
- Tablas ALM: `alm_projects`, `alm_tasks`, `alm_time_entries`.
- IDs en ALM son `TEXT` (no UUID) y se generan desde la API.

Este módulo sigue las convenciones de `backend/docs/api/convenciones-api.md`:
- Envelope obligatorio (`success`, `data`, `meta/error`)
- JSON en `camelCase`
- Fechas en ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`)
- Paginación con `page` y `limit`

## Proyectos

- `GET /projects`
- `POST /projects`
- `GET /projects/{id}`
- `PUT /projects/{id}`
- `DELETE /projects/{id}`
- `GET /projects/{id}/tasks`
- `GET /projects/{id}/stats`

Filtros en listado:
- `companyId`, `status`, `clientId`, `responsibleId`, `startDate`, `endDate`
- `page`, `limit`, `sort`

`sort` soporta: `name`, `startDate`, `endDate`, `status`, `createdAt` (prefijo `-` para DESC).

Ejemplo POST `/projects`:
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

Ejemplo response (listado con `meta`):
```json
{
  "success": true,
  "data": [
    {
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
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

Respuesta `GET /projects/{id}/stats`:
```json
{
  "success": true,
  "data": {
    "totalTasks": 12,
    "pending": 4,
    "inProgress": 6,
    "completed": 2,
    "completionPercent": 17,
    "estimatedHours": 80,
    "realHours": 24
  }
}
```

## Tareas

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{id}`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`
- `PATCH /tasks/{id}/status`
- `PATCH /tasks/{id}/assign`

Filtros en listado:
- `companyId`, `status`, `priority`, `projectId`, `assignedTo`, `dueDate`
- `page`, `limit`, `sort`

`sort` soporta: `title`, `status`, `priority`, `dueDate`, `createdAt` (prefijo `-` para DESC).

Ejemplo POST `/tasks`:
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

Ejemplo PATCH `/tasks/{id}/status`:
```json
{ "status": "in_progress" }
```

Ejemplo PATCH `/tasks/{id}/assign`:
```json
{ "assignedTo": "usr_20" }
```

## Tiempos (registro de horas)

- `GET /times`
- `POST /times`
- `PUT /times/{id}`
- `DELETE /times/{id}`
- `GET /times/project/{id}/summary`
- `GET /times/user/{id}`
- `GET /times/task/{id}`

Filtros en listado:
- `companyId`, `taskId`, `userId`, `entryDate`
- `page`, `limit`

Ejemplo POST `/times`:
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

Respuesta `GET /times/project/{id}/summary`:
```json
{
  "success": true,
  "data": {
    "projectId": "proj_100",
    "entries": 8,
    "totalHours": 24
  }
}
```

## Errores (formato estándar)
Ejemplo `400` (validación):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Datos invalidos",
    "details": [
      { "field": "status", "message": "Debe ser uno de: planned, in_progress, paused, completed" }
    ]
  }
}
```

Ejemplo `404`:
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Proyecto no encontrado",
    "details": []
  }
}
```

## Enums
- `project.status`: `planned | in_progress | paused | completed`
- `task.status`: `pending | in_progress | completed`
- `task.priority`: `low | medium | high`

## Tablas (referencia DB)
- `alm_projects`
- `alm_tasks`
- `alm_time_entries`
