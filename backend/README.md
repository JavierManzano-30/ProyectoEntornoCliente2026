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

- `docs/modulos/<modulo>/informacion.md`
- `docs/modulos/<modulo>/funcionalidades.md`
- `docs/api/modulos/<modulo>.md`
- `docs/database/modelo-datos-backend.md`
- `docs/database/media/modelo-global-er.png`
- `docs/api/convenciones-api.md`

---

## 👤 Alberto: CORE + Coordinacion de Arquitectura

### Módulo Asignado
**CORE** (Usuarios, Empresas, Roles, Permisos, Autenticacion)

### Entregables del Modulo (obligatorio)
- `docs/modulos/core/informacion.md`
- `docs/modulos/core/funcionalidades.md`
- `docs/api/modulos/core.md`

### Coordinacion (extra)
- `docs/templates/descripcion.md`
- `docs/templates/entidades.md`
- `docs/templates/endpoints.md`

---

## 👤 Bartolome: RRHH + Coordinacion de Modelo de Datos

### Modulo Asignado
**RRHH** (Recursos Humanos)

### Entregables del Modulo (obligatorio)
- `docs/modulos/rrhh/informacion.md`
- `docs/modulos/rrhh/funcionalidades.md`
- `docs/api/modulos/rrhh.md`

### Coordinacion (obligatorio)
- `docs/database/media/modelo-global-er.png`
- `docs/database/modelo-datos-backend.md`

---

## 👤 Paco: CRM + Coordinacion de APIs

### Modulo Asignado
**CRM** (Customer Relationship Management)

### Entregables del Modulo (obligatorio)
- `docs/modulos/crm/informacion.md`
- `docs/modulos/crm/funcionalidades.md`
- `docs/api/modulos/crm.md`

### Coordinacion (extra)
- `docs/api/convenciones-api.md`

---

## 👤 Javier: ALM + Coordinacion de Integraciones

### Modulo Asignado
**ALM** (Gestion de Proyectos y Tareas)

### Entregables del Modulo (obligatorio)
- `docs/modulos/alm/informacion.md`
- `docs/modulos/alm/funcionalidades.md`
- `docs/api/modulos/alm.md`

---

## 👤 Hernan: BPM + ERP

### Modulos Asignados
**BPM** + **ERP**

### BPM (obligatorio)
- `docs/modulos/bpm/informacion.md`
- `docs/modulos/bpm/funcionalidades.md`
- `docs/api/modulos/bpm.md`

### ERP (obligatorio)
- `docs/modulos/erp/informacion.md`
- `docs/modulos/erp/funcionalidades.md`
- `docs/api/modulos/erp.md`

---

## 👤 David: Soporte/Tickets + BI

### Soporte (obligatorio)
- `docs/modulos/soporte/informacion.md`
- `docs/modulos/soporte/funcionalidades.md`
- `docs/api/modulos/soporte.md`

### BI (obligatorio)
- `docs/modulos/bi/informacion.md`
- `docs/modulos/bi/funcionalidades.md`
- `docs/api/modulos/bi.md`

---

## 📂 Estructura de Carpetas (resumen)

```
/docs
  /api
  /database
    /media
  /modulos
    /core /rrhh /crm /bpm /erp /alm /soporte /bi
  /templates
```

---

## 📋 Tareas comunes para todos

- Informacion: finalidad, alcance, usuarios y datos.
- Funcionalidades: lista de capacidades y relaciones clave.
- Endpoints: lista de endpoints por modulo, sin payloads ni ejemplos detallados.

---

## ✅ Entregables finales del Sprint 1

1. **Documentacion de modulos** (informacion, funcionalidades, endpoints)
2. **Modelo de datos backend** (`docs/database/modelo-datos-backend.md`)
3. **Diagrama ER global** (`docs/database/media/modelo-global-er.png`)
4. **Convenciones de API** (`docs/api/convenciones-api.md`)

---

## 📝 Notas importantes

- En Sprint 1 no se desarrolla codigo, solo documentacion.
- Priorizar coherencia entre modulos e integraciones claras.
- Si algo responde a "como se implementa", es Sprint 2+.
