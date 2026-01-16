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

### Proyectos
- `GET /alm/proyectos`
- `POST /alm/proyectos`
- `GET /alm/proyectos/{id}`
- `PUT /alm/proyectos/{id}`
- `DELETE /alm/proyectos/{id}`
- `GET /alm/proyectos/{id}/tareas`

### Tareas
- `GET /alm/tareas`
- `POST /alm/tareas`
- `GET /alm/tareas/{id}`
- `PUT /alm/tareas/{id}`
- `DELETE /alm/tareas/{id}`

## Relaciones clave (para frontend)
- `proyectos.responsable_id` -> `usuarios.id`
- `proyectos.cliente_id` -> `clientes.id` (CRM)
- `tareas.asignado_a` -> `usuarios.id`
- `tareas.proyecto_id` -> `proyectos.id`
