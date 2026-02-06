# RRHH Backend - Guía rápida para Frontend

Este documento resume qué endpoints existen en el backend de **Recursos Humanos (RRHH)** y cómo consumirlos desde el frontend.

Base URL: `/api/v1/rrhh`  
Auth: `Authorization: Bearer <token>`

Este módulo sigue las convenciones de `backend/docs/api/convenciones-api.md`:
- Envelope obligatorio (`success`, `data`, `meta/error`)
- JSON en `camelCase`
- Fechas en ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`)
- Paginación con `page` y `limit`

---

## 👥 Empleados

Endpoints principales:

- `GET /empleados`
- `POST /empleados`
- `GET /empleados/{id}`
- `PUT /empleados/{id}`
- `DELETE /empleados/{id}` _(baja lógica: pasa a `inactive`)_

Filtros en listado:
- `empresaId`
- `departamentoId`
- `estado` (`active`, `inactive`, ...)
- `search` (nombre, apellidos, email)
- `page`, `limit`

Ejemplo POST `/empleados`:
```json
{
  "empresaId": "emp_1",
  "nombre": "Juan",
  "apellidos": "Pérez García",
  "email": "juan.perez@empresa.com",
  "estado": "active",
  "fechaAlta": "2026-02-01",
  "departamentoId": "uuid-depto",
  "usuarioId": "uuid-usuario-core-opcional"
}
```

Respuesta típica (listado con `meta`):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-empleado",
      "empresaId": "emp_1",
      "nombre": "Juan",
      "apellidos": "Pérez García",
      "email": "juan.perez@empresa.com",
      "estado": "active",
      "fechaAlta": "2026-02-01",
      "departamentoId": "uuid-depto",
      "usuarioId": "uuid-usuario-core-opcional",
      "createdAt": "2026-02-01T10:00:00Z"
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

---

## 🏢 Departamentos

- `GET /departamentos`
- `POST /departamentos`
- `GET /departamentos/{id}`
- `PUT /departamentos/{id}`
- `DELETE /departamentos/{id}`

Filtros en listado:
- `empresaId`
- `activo` (`true` / `false`)
- `page`, `limit`

Ejemplo POST `/departamentos`:
```json
{
  "empresaId": "emp_1",
  "nombre": "Tecnología",
  "parentDepartmentId": null,
  "activo": true
}
```

---

## 📄 Contratos

- `GET /contratos`
- `POST /contratos`
- `GET /contratos/{id}`
- `PUT /contratos/{id}`
- `DELETE /contratos/{id}`

Filtros en listado:
- `empresaId`
- `empleadoId`
- `activo` (`true` / `false`)
- `page`, `limit`

Ejemplo POST `/contratos`:
```json
{
  "empresaId": "emp_1",
  "empleadoId": "uuid-empleado",
  "fechaInicio": "2026-02-01",
  "fechaFin": null,
  "tipoContrato": "indefinido",
  "salario": 28000.00,
  "activo": true
}
```

---

## 🗓️ Ausencias

- `GET /ausencias`
- `POST /ausencias`
- `GET /ausencias/{id}`
- `PUT /ausencias/{id}`
- `DELETE /ausencias/{id}`
- `PATCH /ausencias/{id}/aprobar`
- `PATCH /ausencias/{id}/rechazar`

Filtros en listado:
- `empresaId`
- `empleadoId`
- `estado` (`pending`, `approved`, `rejected`)
- `tipo` (vacaciones, baja, permiso, etc. según negocio)
- `page`, `limit`

Ejemplo POST `/ausencias`:
```json
{
  "empresaId": "emp_1",
  "empleadoId": "uuid-empleado",
  "tipo": "vacaciones",
  "fechaInicio": "2026-08-01",
  "fechaFin": "2026-08-15",
  "estado": "pending",
  "notas": "Vacaciones de verano"
}
```

---

## 💰 Nóminas

> Solo se permite **crear** y **consultar**. No hay actualización ni borrado (histórico inmutable).

- `GET /nominas`
- `POST /nominas`
- `GET /nominas/{id}`

Filtros en listado:
- `empresaId`
- `empleadoId`
- `periodo` (formato `YYYY-MM`)
- `page`, `limit`

Ejemplo POST `/nominas`:
```json
{
  "empresaId": "emp_1",
  "empleadoId": "uuid-empleado",
  "periodo": "2026-01",
  "importeBruto": 2500.00,
  "importeNeto": 2000.00
}
```

---

## ⭐ Evaluaciones de desempeño

> Se registran evaluaciones históricas (no se actualizan ni se borran, solo se consultan).

- `GET /evaluaciones`
- `POST /evaluaciones`
- `GET /evaluaciones/{id}`

Filtros en listado:
- `empresaId`
- `empleadoId`
- `page`, `limit`

Reglas importantes:
- `puntuacion` debe ser numérica entre `0` y `100`.

Ejemplo POST `/evaluaciones`:
```json
{
  "empresaId": "emp_1",
  "empleadoId": "uuid-empleado",
  "puntuacion": 85,
  "fechaRevision": "2026-01-31",
  "notas": "Buen rendimiento general"
}
```
