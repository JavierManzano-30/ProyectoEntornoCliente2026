````md
# 📘 Documentación API - Módulo RRHH

Esta referencia describe los endpoints públicos del módulo **RRHH** siguiendo las convenciones establecidas en [`docs/api/convenciones-api.md`](../convenciones-api.md).

**Base URL:** `/api/v1/rrhh`

---

## 1. Empleados

### `GET /api/v1/rrhh/empleados`
**Descripción:** Lista paginada de empleados de la empresa.

**Query Params:**
- `status` (opcional): `activo` | `inactivo` | `baja`
- `departmentId` (opcional): Filtrar por departamento
- `search` (opcional): Búsqueda por nombre, apellidos o email corporativo
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, max: 100)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "Ana",
      "lastName": "López",
      "email": "ana.lopez@empresa.com",
      "departmentId": "uuid",
      "status": "activo",
      "hireDate": "2026-01-15",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 40,
    "totalPages": 4
  }
}
````

---

### `GET /api/v1/rrhh/empleados/:id`

**Descripción:** Obtiene el detalle completo de un empleado.

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Ana",
    "lastName": "López",
    "email": "ana.lopez@empresa.com",
    "status": "activo",
    "departmentId": "uuid",
    "hireDate": "2026-01-15",
    "userId": "uuid"
  }
}
```

---

### `POST /api/v1/rrhh/empleados`

**Descripción:** Crea un nuevo empleado.

**Body:**

```json
{
  "firstName": "Carlos",
  "lastName": "Pérez",
  "email": "carlos.perez@empresa.com",
  "hireDate": "2026-02-01",
  "departmentId": "uuid",
  "userId": "uuid"
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Carlos",
    "lastName": "Pérez",
    "status": "activo",
    "createdAt": "2026-02-01T09:00:00Z"
  }
}
```

---

### `PUT /api/v1/rrhh/empleados/:id`

**Descripción:** Actualiza los datos de un empleado (reemplazo completo).

---

### `DELETE /api/v1/rrhh/empleados/:id`

**Descripción:** Da de baja lógica a un empleado (no se elimina físicamente).

---

## 2. Departamentos

### `GET /api/v1/rrhh/departamentos`

**Descripción:** Lista de departamentos activos e inactivos.

**Query Params:**

* `active` (opcional): `true` | `false`
* `page` (opcional)
* `limit` (opcional)

---

### `POST /api/v1/rrhh/departamentos`

**Descripción:** Crea un nuevo departamento.

**Body:**

```json
{
  "name": "Tecnología",
  "parentDepartmentId": "uuid"
}
```

---

### `PUT /api/v1/rrhh/departamentos/:id`

**Descripción:** Actualiza un departamento (por ejemplo, nombre o jerarquía).

---

## 3. Contratos

### `GET /api/v1/rrhh/contratos`

**Descripción:** Lista de contratos filtrables por empleado y vigencia.

**Query Params:**

* `employeeId` (opcional)
* `active` (opcional): `true` | `false`
* `page` (opcional)
* `limit` (opcional)

---

### `POST /api/v1/rrhh/contratos`

**Descripción:** Crea un contrato asociado a un empleado.

**Body:**

```json
{
  "employeeId": "uuid",
  "startDate": "2026-02-01",
  "endDate": null,
  "contractType": "indefinido",
  "salary": 28000
}
```

---

### `PUT /api/v1/rrhh/contratos/:id`

**Descripción:** Actualiza un contrato existente.

---

## 4. Ausencias

### `GET /api/v1/rrhh/ausencias`

**Descripción:** Lista de ausencias del sistema, filtrables por empleado, fechas y estado.

**Query Params:**

* `employeeId` (opcional)
* `status` (opcional): `pendiente` | `aprobada` | `rechazada`
* `type` (opcional): `vacaciones` | `baja_medica` | `permiso`
* `dateFrom` (opcional): ISO Date (`YYYY-MM-DD`)
* `dateTo` (opcional): ISO Date (`YYYY-MM-DD`)
* `page` (opcional)
* `limit` (opcional)

---

### `POST /api/v1/rrhh/ausencias`

**Descripción:** Registra una solicitud de ausencia para un empleado (requiere aprobación en BPM).

**Body:**

```json
{
  "employeeId": "uuid",
  "type": "vacaciones",
  "startDate": "2026-03-10",
  "endDate": "2026-03-15",
  "notes": "Viaje programado"
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employeeId": "uuid",
    "status": "pendiente"
  }
}
```

---

### `PUT /api/v1/rrhh/ausencias/:id`

**Descripción:** Modifica una ausencia (si está en estado pendiente).

---

## 5. Nóminas

### `GET /api/v1/rrhh/nominas`

**Descripción:** Lista de nóminas filtrables por empleado y periodo.

**Query Params:**

* `employeeId` (opcional)
* `period` (opcional): formato recomendado `YYYY-MM`
* `page` (opcional)
* `limit` (opcional)

---

### `POST /api/v1/rrhh/nominas`

**Descripción:** Genera/crea una nómina para un empleado en un periodo dado.

**Body:**

```json
{
  "employeeId": "uuid",
  "period": "2026-01",
  "grossAmount": 2500,
  "netAmount": 1900
}
```

---

### `GET /api/v1/rrhh/nominas/:id`

**Descripción:** Obtiene el detalle de una nómina.

---

## 6. Evaluaciones de desempeño

### `GET /api/v1/rrhh/evaluaciones`

**Descripción:** Lista de evaluaciones filtrables por empleado o fechas.

**Query Params:**

* `employeeId` (opcional)
* `dateFrom` (opcional)
* `dateTo` (opcional)
* `page` (opcional)
* `limit` (opcional)

---

### `POST /api/v1/rrhh/evaluaciones`

**Descripción:** Crea una evaluación de desempeño para un empleado.

**Body:**

```json
{
  "employeeId": "uuid",
  "score": 85,
  "reviewDate": "2026-01-31",
  "notes": "Buen desempeño general y mejora en liderazgo."
}
```

---

### `PUT /api/v1/rrhh/evaluaciones/:id`

**Descripción:** Actualiza una evaluación existente.

---

## 7. Endpoints de apoyo (para integraciones internas)

### `GET /api/v1/rrhh/empleados/:id/resumen`

**Descripción:** Devuelve un resumen del empleado (útil para ALM, Soporte y BPM).

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Ana López",
    "departmentName": "Tecnología",
    "status": "activo"
  }
}
```

---

## Relaciones clave (para frontend)

* `empleados.userId` -> `usuarios.id` (CORE)
* `empleados.departmentId` -> `departamentos.id` (RRHH)
* `contratos.employeeId` -> `empleados.id` (RRHH)
* `ausencias.employeeId` -> `empleados.id` (RRHH)
* `nominas.employeeId` -> `empleados.id` (RRHH)
* `evaluaciones.employeeId` -> `empleados.id` (RRHH)

Notas de integración:

* Las ausencias requieren flujo de aprobación gestionado por BPM.
* Los empleados se utilizan en ALM para asignación de tareas y proyectos.
* Los empleados se utilizan en Soporte para asignación/identificación de tickets.
* Las nóminas pueden sincronizarse con ERP para costes salariales y contabilidad.

---

```
```
