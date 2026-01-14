# Sprint 1 - Distribucion de Trabajo Backend

## 📋 Contexto del Sprint

**Duracion**: 2 semanas  
**Equipo Backend**: 6 desarrolladores  
**Objetivo**: Definir, organizar y documentar el producto antes de programar

**Modalidad de trabajo**:
- **Viernes**: 6 horas presenciales/sincronas (reunion con todo el equipo)
- **Resto de semana**: Trabajo asincrono individual

## 🎯 Modulos del Producto

- **CORE** (Usuarios, Empresas, Roles, Autenticacion)
- **RRHH** (Empleados, Nominas, Ausencias)
- **CRM** (Clientes, Oportunidades, Pipeline)
- **BPM** (Procesos, Aprobaciones, Workflows)
- **ERP** (Productos, Inventario, Facturacion)
- **ALM** (Proyectos, Tareas, Sprints)
- **Soporte/Tickets** (Gestion de incidencias)
- **BI** (Business Intelligence, Analisis de datos)

## 👥 Distribucion de Modulos y Responsabilidades

| Desarrollador | Modulo(s) | Coordinacion |
|---|---|---|
| **Dev Backend 1** | CORE | Arquitectura Backend |
| **Dev Backend 2** | RRHH | Modelo de Datos Global |
| **Dev Backend 3** | CRM | APIs (alto nivel) |
| **Dev Backend 4** | ALM | Integraciones |
| **Dev Backend 5** | BPM + ERP | - |
| **Dev Backend 6** | Soporte + BI | - |

---

## ✅ Entregables obligatorios (Sprint 1)

- `docs/producto/analisis-producto.md`
- `docs/modulos/<modulo>/descripcion.md`
- `docs/modulos/<modulo>/entidades.md`
- `docs/modulos/<modulo>/integraciones.md`
- `docs/database/global/modelo-global-er.png` y `docs/database/global/modelo-global.dbml`
- `docs/integraciones/documento-integraciones.md`
- `docs/integraciones/matriz-integraciones.md`
- `docs/equipo/organizacion-equipo.md`
- `docs/equipo/metodologia-trabajo.md`
- `docs/api/modulos/*.md` (lista de endpoints por modulo, alto nivel)

## ⭐ Extras (si hay tiempo)

- `docs/arquitectura/`
- `docs/templates/`
- `docs/api/convenciones-api.md`
- `docs/api/catalogo-endpoints.md`
- `docs/database/global/script-creacion-tablas.sql`
- `docs/database/convenviones/`
- `docs/database/modulos/*/er.png` y `docs/database/modulos/*/er.dbml`
- `docs/integraciones/diagrama-flujo-datos.png`
- `docs/integraciones/secuencia-desarrollo.md`

---

## 👤 Alberto: CORE + Coordinacion de Arquitectura

### Módulo Asignado
**CORE** (Usuarios, Empresas, Roles, Permisos, Autenticacion)

### Entregables del Modulo (obligatorio)
- `docs/modulos/core/descripcion.md`
- `docs/modulos/core/entidades.md`
- `docs/modulos/core/integraciones.md`
- `docs/api/modulos/core.md` (lista de endpoints, sin payloads)

### Coordinacion (extra)
- `docs/arquitectura/arquitectura-backend.md`
- `docs/arquitectura/estructura-carpetas.md`
- `docs/arquitectura/convenciones-codigo.md`
- `docs/templates/`

---

## 👤 Bartolome: RRHH + Coordinacion de Modelo de Datos

### Modulo Asignado
**RRHH** (Recursos Humanos)

### Entregables del Modulo (obligatorio)
- `docs/modulos/rrhh/descripcion.md`
- `docs/modulos/rrhh/entidades.md`
- `docs/modulos/rrhh/integraciones.md`
- `docs/api/modulos/rrhh.md`

### Coordinacion (obligatorio)
- `docs/database/global/modelo-global-er.png`
- `docs/database/global/modelo-global.dbml`

### Coordinacion (extra)
- `docs/database/global/script-creacion-tablas.sql`
- `docs/database/convenviones/`

---

## 👤 Paco: CRM + Coordinacion de APIs

### Modulo Asignado
**CRM** (Customer Relationship Management)

### Entregables del Modulo (obligatorio)
- `docs/modulos/crm/descripcion.md`
- `docs/modulos/crm/entidades.md`
- `docs/modulos/crm/integraciones.md`
- `docs/api/modulos/crm.md`

### Coordinacion (extra)
- `docs/api/convenciones-api.md`
- `docs/api/catalogo-endpoints.md`
- `docs/coordinacion/acuerdos-frontend-backend.md`

---

## 👤 Javier: ALM + Coordinacion de Integraciones

### Modulo Asignado
**ALM** (Gestion de Proyectos y Tareas)

### Entregables del Modulo (obligatorio)
- `docs/modulos/alm/descripcion.md`
- `docs/modulos/alm/entidades.md`
- `docs/modulos/alm/integraciones.md`
- `docs/api/modulos/alm.md`

### Coordinacion (obligatorio)
- `docs/integraciones/documento-integraciones.md`
- `docs/integraciones/matriz-integraciones.md`

### Coordinacion (extra)
- `docs/integraciones/diagrama-flujo-datos.png`
- `docs/integraciones/secuencia-desarrollo.md`

---

## 👤 Hernan: BPM + ERP

### Modulos Asignados
**BPM** + **ERP**

### BPM (obligatorio)
- `docs/modulos/bpm/descripcion.md`
- `docs/modulos/bpm/entidades.md`
- `docs/modulos/bpm/integraciones.md`
- `docs/api/modulos/bpm.md`

### BPM (extra)
- `docs/modulos/bpm/sistema-aprobaciones.md`

### ERP (obligatorio)
- `docs/modulos/erp/descripcion.md`
- `docs/modulos/erp/entidades.md`
- `docs/modulos/erp/integraciones.md`
- `docs/api/modulos/erp.md`

---

## 👤 David: Soporte/Tickets + BI

### Soporte (obligatorio)
- `docs/modulos/soporte/descripcion.md`
- `docs/modulos/soporte/entidades.md`
- `docs/modulos/soporte/integraciones.md`
- `docs/api/modulos/soporte.md`

### BI (obligatorio)
- `docs/modulos/bi/descripcion.md`
- `docs/modulos/bi/entidades.md`
- `docs/modulos/bi/integraciones.md`
- `docs/api/modulos/bi.md`

### BI (extra)
- `docs/modulos/bi/dashboards.md`
- `docs/modulos/bi/metricas.md`

---

## 📂 Estructura de Carpetas (resumen)

```
/docs
  /api
    /modulos
  /arquitectura
  /coordinacion
  /database
    /global
    /modulos
  /equipo
  /integraciones
  /modulos
    /core /rrhh /crm /bpm /erp /alm /soporte /bi
  /producto
  /templates
```

---

## 📋 Tareas comunes para todos

- Descripcion de modulo: finalidad, funcionalidades clave, usuarios y datos.
- Entidades: tablas, campos clave y relaciones.
- Integraciones: que consume y que expone (con FKs o campo relacion).
- API: lista de endpoints por modulo, sin payloads ni ejemplos detallados.

---

## ✅ Entregables finales del Sprint 1

1. **Documento de analisis del producto** (`docs/producto/analisis-producto.md`)
2. **Documentacion de modulos** (descripcion, entidades, integraciones)
3. **Modelo de datos global** (`docs/database/global/modelo-global-er.png` y `docs/database/global/modelo-global.dbml`)
4. **Documento de integraciones** (`docs/integraciones/documento-integraciones.md`)
5. **Organizacion del equipo** (`docs/equipo/organizacion-equipo.md`)
6. **Metodologia de trabajo** (`docs/equipo/metodologia-trabajo.md`)
7. **Endpoints por modulo (alto nivel)** (`docs/api/modulos/*.md`)

---

## 📝 Notas importantes

- En Sprint 1 no se desarrolla codigo, solo documentacion.
- Priorizar coherencia entre modulos e integraciones claras.
- Si algo responde a "como se implementa", es Sprint 2+.
