# Convenciones de API REST

Este documento define los estándares obligatorios para el diseño y desarrollo de la API del proyecto. Todo el equipo de backend debe adherirse a estas reglas para asegurar consistencia y mantenibilidad.

## 1. URI y Versionado
*   **Base URL:** Todas las rutas deben comenzar con `/api/v1`.
    *   Ejemplo: `/api/v1/crm/clientes`
*   **Recursos:** Utilizar sustantivos en plural para nombrar recursos. Utilizar `kebab-case` si el recurso es compuesto (aunque preferimos una sola palabra).
    *   Bien: `/usuarios`, `/facturas-clientes`
    *   Mal: `/getUsuarios`, `/factura`
*   **Anidamiento:** Máximo 1 nivel de profundidad para sub-recursos dependientes.
    *   Bien: `/clientes/5/contactos`
    *   Evitar: `/clientes/5/oportunidades/10/actividades` (Usar filtros en `/actividades` en su lugar).

## 2. Formato de Respuesta (Envelope)
Todas las respuestas deben seguir una estructura JSON unificada (Envelope Pattern) para facilitar el consumo en el frontend.

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... },     // Objeto o Array con los datos solicitados
  "meta": { ... }      // Opcional: Paginación, totales, etc.
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "El cliente con ID 55 no existe.",
    "details": []      // Opcional: Lista de errores de validación por campo
  }
}
```

## 3. Métodos HTTP
Usar los verbos HTTP correctamente según la acción semántica:
*   `GET`: Leer recursos. Idempotente.
*   `POST`: Crear recursos nuevos. No idempotente.
*   `PUT`: Reemplazar un recurso completo. Idempotente.
*   `PATCH`: Modificación parcial de un recurso.
*   `DELETE`: Eliminar un recurso.

## 4. Códigos de Estado (Status Codes)
*   `200 OK`: Petición exitosa estándar (GET, PUT, PATCH).
*   `201 Created`: Recurso creado exitosamente (POST).
*   `204 No Content`: Acción exitosa sin cuerpo de respuesta (DELETE).
*   `400 Bad Request`: Error de validación o sintaxis en la petición.
*   `401 Unauthorized`: No hay token o es inválido (No autenticado).
*   `403 Forbidden`: Token válido pero sin permisos suficientes (No autorizado).
*   `404 Not Found`: El recurso no existe.
*   `500 Internal Server Error`: Error no controlado del servidor (Bug).

## 5. Autenticación y Seguridad
*   **Mecanismo:** JWT (JSON Web Tokens).
*   **Header:** Debe enviarse en la cabecera `Authorization` con esquema `Bearer`.
    *   `Authorization: Bearer <token_jwt>`
*   **CORS:** Activado, restringido solo al dominio del frontend en producción.

## 6. Paginación
Para endpoints de listas (`GET`), usar los query parameters estándar:
*   `page`: Número de página (empieza en 1).
*   `limit`: Elementos por página (defecto 10, máx 100).

Respuesta de paginación en `meta`:
```json
"meta": {
  "page": 1,
  "limit": 10,
  "totalItems": 150,
  "totalPages": 15
}
```

## 7. Naming Conventions (JSON)
*   **Propiedades:** `camelCase`.
    *   Bien: `fechaCreacion`, `usuarioId`
    *   Mal: `fecha_creacion`, `UsuarioId`
*   **Fechas:** Formato **ISO 8601** UTC (`YYYY-MM-DDTHH:mm:ssZ`).
