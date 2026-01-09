# Sprint 1 - Distribución de Trabajo Backend

## 📋 Contexto del Sprint

**Duración**:  2 semanas  
**Equipo Backend**: 6 desarrolladores  
**Objetivo**: Definir, organizar y documentar el producto antes de programar  

**Modalidad de trabajo**:
- **Viernes**:  6 horas presenciales/síncronas (reunión con todo el equipo)
- **Resto de semana**: Trabajo asíncrono individual

## 🎯 Módulos del Producto

- **CORE** (Usuarios, Empresas, Roles, Autenticación)
- **RRHH** (Empleados, Nóminas, Ausencias)
- **CRM** (Clientes, Oportunidades, Pipeline)
- **BPM** (Procesos, Aprobaciones, Workflows)
- **ERP** (Productos, Inventario, Facturación)
- **ALM** (Proyectos, Tareas, Sprints)
- **Soporte/Tickets** (Gestión de incidencias)
- **BI** (Business Intelligence, Análisis de datos)

## 👥 Distribución de Módulos y Responsabilidades

| Desarrollador | Módulo(s) | Responsabilidad de Coordinación |
|---------------|-----------|----------------------------------|
| **Dev Backend 1** | CORE | Arquitectura Backend |
| **Dev Backend 2** | RRHH | Modelo de Datos Global |
| **Dev Backend 3** | CRM | Catálogo de APIs |
| **Dev Backend 4** | ALM | Integraciones entre Módulos |
| **Dev Backend 5** | BPM + ERP | - |
| **Dev Backend 6** | Soporte + BI | - |

---

## 👤 Dev Backend 1: CORE + Coordinación de Arquitectura

### Módulo Asignado
**CORE** (Usuarios, Empresas, Roles, Permisos, Autenticación)

### Entregables del Módulo

#### Documentación
- [ ] `docs/modulos/core-descripcion.md`
  - Finalidad del módulo
  - Funcionalidades principales
  - Usuarios que lo utilizan
  - Datos que gestiona
  - Problemas que resuelve
  - Métricas para BI

- [ ] `docs/modulos/core-entidades.md`
  - Entidades:  Usuario, Empresa, Rol, Permiso, Sesión
  - Campos de cada entidad (nombre, tipo, nullable, clave, descripción)
  - Relaciones con otros módulos
  - Reglas de negocio

- [ ] `docs/modulos/core-integraciones.md`
  - Datos que consume de otros módulos
  - Datos que expone (Usuario ↔ Empleado en RRHH)

#### Base de Datos
- [ ] `docs/database/modulos/core-er.png` - Diagrama ER del módulo
- [ ] `docs/database/modulos/core-er.dbml` - Código DBML

#### API
- [ ] `docs/api/modulos/core-endpoints. md`
  - POST /api/v1/auth/login
  - POST /api/v1/auth/logout
  - POST /api/v1/auth/refresh
  - GET /api/v1/usuarios
  - POST /api/v1/usuarios
  - GET /api/v1/roles
  - POST /api/v1/roles

### Entregables de Coordinación (Arquitectura)

- [ ] `docs/arquitectura/arquitectura-backend.md`
  - Arquitectura general del backend
  - Stack tecnológico (Node.js, Express, Sequelize, PostgreSQL)
  - Patrones arquitectónicos (Controller → Service → Repository → Model)

- [ ] `docs/arquitectura/estructura-carpetas.md`
  - Estructura de carpetas estándar para todos los módulos

- [ ] `docs/arquitectura/convenciones-codigo.md`
  - Convenciones de código
  - Nomenclatura de variables, funciones, archivos

- [ ] `docs/templates/` - Plantillas de documentación
  - `plantilla-descripcion-modulo.md`
  - `plantilla-entidades.md`
  - `plantilla-endpoints.md`

### Documentos Consolidados

- [ ] `docs/producto/analisis-producto.md`
  - Nombre del producto
  - Objetivo general
  - Tipo de empresas objetivo
  - Problemas que resuelve

- [ ] `docs/equipo/organizacion-equipo.md`
  - Roles y responsabilidades del equipo
  - Distribución de módulos

- [ ] `docs/equipo/metodologia-trabajo.md`
  - Forma de trabajo por sprints
  - Herramientas (GitHub, dbdiagram. io, Slack)
  - Flujo de trabajo (GitFlow)

---

## 👤 Dev Backend 2: RRHH + Coordinación de Modelo de Datos

### Módulo Asignado
**RRHH** (Recursos Humanos)

### Entregables del Módulo

#### Documentación
- [ ] `docs/modulos/rrhh-descripcion. md`
  - Finalidad del módulo
  - Funcionalidades principales
  - Usuarios que lo utilizan
  - Datos que gestiona

- [ ] `docs/modulos/rrhh-entidades. md`
  - Entidades: Empleado, Departamento, Nómina, Ausencia, Contrato, Evaluación
  - Campos de cada entidad
  - Relaciones (Empleado ↔ Departamento, Empleado ↔ Usuario)
  - Reglas de negocio

- [ ] `docs/modulos/rrhh-integraciones.md`
  - RRHH → ALM (Empleado asignado a tareas)
  - RRHH ↔ BPM (Aprobación de ausencias)
  - RRHH ↔ CORE (Empleado ↔ Usuario)

#### Base de Datos
- [ ] `docs/database/modulos/rrhh-er.png` - Diagrama ER del módulo
- [ ] `docs/database/modulos/rrhh-er.dbml` - Código DBML

#### API
- [ ] `docs/api/modulos/rrhh-endpoints.md`
  - Endpoints de empleados, departamentos, nóminas, ausencias, evaluaciones

### Entregables de Coordinación (Modelo de Datos)

- [ ] `docs/database/modelo-global-er.png`
  - **Diagrama ER consolidado de TODOS los módulos**

- [ ] `docs/database/modelo-global.dbml`
  - Código DBML del modelo global

- [ ] `docs/database/script-creacion-tablas.sql`
  - Script SQL generado automáticamente desde dbdiagram.io

- [ ] `docs/database/campos-obligatorios.md`
  - Campos que TODAS las tablas deben tener: 
    - `empresa_id` (multi-tenancy)
    - `created_at`, `updated_at`
    - `created_by`, `updated_by` (tablas importantes)

- [ ] `docs/database/convenciones-nomenclatura.md`
  - Tablas:  `snake_case` plural (ej: `empleados`)
  - Campos: `snake_case` (ej: `nombre_completo`)
  - Claves primarias: `id`
  - Claves foráneas: `{tabla_singular}_id` (ej: `empleado_id`)

---

## 👤 Dev Backend 3: CRM + Coordinación de APIs

### Módulo Asignado
**CRM** (Customer Relationship Management)

### Entregables del Módulo

#### Documentación
- [ ] `docs/modulos/crm-descripcion.md`
  - Finalidad del módulo
  - Funcionalidades principales
  - Usuarios que lo utilizan

- [ ] `docs/modulos/crm-entidades.md`
  - Entidades: Cliente, Contacto, Oportunidad, Pipeline, Actividad
  - Campos de cada entidad
  - Relaciones (Cliente ↔ Contacto, Oportunidad → Cliente)

- [ ] `docs/modulos/crm-integraciones.md`
  - CRM → ALM (Cliente vinculado a Proyecto)
  - CRM → ERP (Cliente → Factura)
  - CRM → Soporte (Cliente → Ticket)

#### Base de Datos
- [ ] `docs/database/modulos/crm-er.png` - Diagrama ER del módulo
- [ ] `docs/database/modulos/crm-er.dbml` - Código DBML

#### API
- [ ] `docs/api/modulos/crm-endpoints.md`
  - Endpoints de clientes, contactos, oportunidades, pipeline, actividades

### Entregables de Coordinación (APIs)

- [ ] `docs/api/convenciones-api.md`
  - Versionado:  `/api/v1/modulo/recurso`
  - Formato de respuesta exitosa: 
    ```json
    {
      "success": true,
      "data":  {... },
      "meta": {...}
    }
    ```
  - Formato de error:
    ```json
    {
      "success": false,
      "error": {
        "code": "ERROR_CODE",
        "message":  "Descripción"
      }
    }
    ```
  - Códigos HTTP estándar (200, 201, 400, 401, 403, 404, 500)
  - Autenticación con Bearer Token (JWT)

- [ ] `docs/api/catalogo-endpoints.md`
  - **Catálogo unificado de TODOS los endpoints** de todos los módulos
  - Índice organizado por módulo

- [ ] `docs/coordinacion/acuerdos-frontend-backend. md`
  - Acuerdos con el equipo de frontend sobre:
    - Formatos de datos
    - Endpoints necesarios
    - Estructura de respuestas

---

## 👤 Dev Backend 4: ALM + Coordinación de Integraciones

### Módulo Asignado
**ALM** (Application Lifecycle Management - Gestión de Proyectos y Tareas)

### Entregables del Módulo

#### Documentación
- [ ] `docs/modulos/alm-descripcion.md`
  - Finalidad del módulo
  - Funcionalidades principales
  - Usuarios que lo utilizan

- [ ] `docs/modulos/alm-entidades.md`
  - Entidades: Proyecto, Tarea, Sprint, Asignación, Comentario, TimeTracking
  - Campos de cada entidad
  - Relaciones (Proyecto → Tarea → Sprint)

- [ ] `docs/modulos/alm-integraciones.md`
  - ALM ↔ RRHH (Empleado asignado a tareas)
  - ALM ↔ CRM (Proyecto vinculado a Cliente)
  - ALM ↔ Soporte (Tarea ↔ Ticket)
  - ALM ↔ BPM (Aprobación de presupuestos)

#### Base de Datos
- [ ] `docs/database/modulos/alm-er.png` - Diagrama ER del módulo
- [ ] `docs/database/modulos/alm-er.dbml` - Código DBML

#### API
- [ ] `docs/api/modulos/alm-endpoints.md`
  - Endpoints de proyectos, tareas, sprints, asignaciones, time tracking

### Entregables de Coordinación (Integraciones)

- [ ] `docs/integraciones/documento-integraciones.md`
  - **Documento consolidado de TODAS las integraciones** entre módulos
  - Para cada integración: 
    - Módulo que consume
    - Módulo que proporciona
    - Campos utilizados como relación (FK)
    - Descripción del flujo

- [ ] `docs/integraciones/matriz-integraciones.md`
  - Tabla/matriz de todas las integraciones: 
    ```
    | Módulo Origen | Módulo Destino | Relación | Campo FK |
    ```

- [ ] `docs/integraciones/diagrama-flujo-datos.png`
  - Diagrama visual de cómo fluyen los datos entre módulos
  - Usar Miro, Draw.io o similar

- [ ] `docs/integraciones/secuencia-desarrollo.md`
  - Orden recomendado de implementación de módulos para futuros sprints
  - Ejemplo:  Sprint 2 (CORE + RRHH), Sprint 3 (CRM + ALM), etc.

---

## 👤 Dev Backend 5: BPM + ERP

### Módulos Asignados
**BPM** (Business Process Management) + **ERP** (Enterprise Resource Planning)

### Entregables del Módulo BPM

#### Documentación
- [ ] `docs/modulos/bpm-descripcion.md`
  - Finalidad del módulo
  - Funcionalidades principales
  - Usuarios que lo utilizan

- [ ] `docs/modulos/bpm-entidades.md`
  - Entidades: Proceso, Aprobación, FlujoDeTrabajo, Tarea
  - Campos de cada entidad
  - Relaciones internas

- [ ] `docs/modulos/bpm-sistema-aprobaciones.md`
  - Cómo BPM gestiona aprobaciones de otros módulos
  - Tabla `aprobaciones` genérica con campos:  `modulo`, `registro_id`, `tipo`, `estado`
  - Flujos de aprobación (ausencias, facturas, presupuestos)

- [ ] `docs/modulos/bpm-integraciones.md`
  - BPM → RRHH (Aprobación de ausencias)
  - BPM → ERP (Aprobación de facturas)
  - BPM → ALM (Aprobación de presupuestos)

#### Base de Datos
- [ ] `docs/database/modulos/bpm-er.png` - Diagrama ER del módulo
- [ ] `docs/database/modulos/bpm-er.dbml` - Código DBML

#### API
- [ ] `docs/api/modulos/bpm-endpoints.md`
  - Endpoints de procesos, aprobaciones, flujos de trabajo

### Entregables del Módulo ERP

#### Documentación
- [ ] `docs/modulos/erp-descripcion.md`
  - Finalidad del módulo
  - Funcionalidades principales

- [ ] `docs/modulos/erp-entidades.md`
  - Entidades: Producto, Inventario, Proveedor, Factura, OrdenDeCompra
  - Campos de cada entidad
  - Relaciones (Factura → Cliente, Producto ↔ Inventario)

- [ ] `docs/modulos/erp-integraciones. md`
  - ERP ↔ CRM (Factura → Cliente)
  - ERP ↔ BPM (Aprobación de facturas)
  - ERP → ALM (Productos usados en proyectos)

#### Base de Datos
- [ ] `docs/database/modulos/erp-er.png` - Diagrama ER del módulo
- [ ] `docs/database/modulos/erp-er.dbml` - Código DBML

#### API
- [ ] `docs/api/modulos/erp-endpoints.md`
  - Endpoints de productos, inventario, facturas, proveedores

---

## 👤 Dev Backend 6: Soporte/Tickets + BI

### Módulos Asignados
**Soporte/Tickets** + **BI** (Business Intelligence)

### Entregables del Módulo Soporte

#### Documentación
- [ ] `docs/modulos/soporte-descripcion.md`
  - Finalidad del módulo
  - Funcionalidades principales
  - Usuarios que lo utilizan

- [ ] `docs/modulos/soporte-entidades. md`
  - Entidades: Ticket, Categoría, SLA, Resolución, Comentario
  - Campos de cada entidad
  - Relaciones (Ticket → Cliente, Ticket → Empleado asignado)

- [ ] `docs/modulos/soporte-integraciones.md`
  - Soporte ↔ CRM (Ticket → Cliente)
  - Soporte ↔ ALM (Ticket ↔ Tarea de desarrollo)
  - Soporte ↔ RRHH (Ticket → Empleado asignado)

#### Base de Datos
- [ ] `docs/database/modulos/soporte-er.png` - Diagrama ER del módulo
- [ ] `docs/database/modulos/soporte-er.dbml` - Código DBML

#### API
- [ ] `docs/api/modulos/soporte-endpoints.md`
  - Endpoints de tickets, categorías, resoluciones, SLA

### Entregables del Módulo BI

#### Documentación
- [ ] `docs/modulos/bi-descripcion.md`
  - Finalidad del módulo
  - Funcionalidades principales
  - Usuarios que lo utilizan

- [ ] `docs/modulos/bi-dashboards.md`
  - Dashboards planeados: 
    - Dashboard Ejecutivo (KPIs generales)
    - Dashboard de RRHH
    - Dashboard de Ventas (CRM)
    - Dashboard de Proyectos (ALM)
    - Dashboard de Soporte
  - Qué métricas muestra cada dashboard

- [ ] `docs/modulos/bi-metricas.md`
  - **Consolidación de métricas de TODOS los módulos**
  - Qué métricas expone cada módulo para BI: 
    - RRHH:  empleados activos, tasa de rotación, ausencias
    - CRM: oportunidades en pipeline, tasa de conversión
    - ALM: proyectos activos, velocidad de equipo
    - Soporte:  tickets abiertos, tiempo de resolución
    - ERP: valor de inventario, facturas pendientes
    - BPM: aprobaciones pendientes, tiempo de aprobación

- [ ] `docs/modulos/bi-integraciones.md`
  - Cómo BI consume datos de todos los módulos
  - BI no tiene FK directas, consume mediante vistas/queries

#### API
- [ ] `docs/api/modulos/bi-endpoints. md`
  - Endpoints de consultas, reportes, dashboards

---

## 📂 Estructura de Carpetas `/docs`
/docs /producto └── analisis-producto.md (Dev 1)

/modulos ├── core-descripcion.md (Dev 1) ├── core-entidades.md (Dev 1) ├── core-integraciones.md (Dev 1) ├── rrhh-descripcion.md (Dev 2) ├── rrhh-entidades.md (Dev 2) ├── rrhh-integraciones.md (Dev 2) ├── crm-descripcion.md (Dev 3) ├── crm-entidades.md (Dev 3) ├── crm-integraciones.md (Dev 3) ├── alm-descripcion.md (Dev 4) ├── alm-entidades.md (Dev 4) ├── alm-integraciones. md (Dev 4) ├── bpm-descripcion.md (Dev 5) ├── bpm-entidades.md (Dev 5) ├── bpm-sistema-aprobaciones.md (Dev 5) ├── bpm-integraciones.md (Dev 5) ├── erp-descripcion.md (Dev 5) ├── erp-entidades.md (Dev 5) ├── erp-integraciones.md (Dev 5) ├── soporte-descripcion.md (Dev 6) ├── soporte-entidades. md (Dev 6) ├── soporte-integraciones.md (Dev 6) ├── bi-descripcion.md (Dev 6) ├── bi-dashboards.md (Dev 6) └── bi-metricas.md (Dev 6)

/database ├── modelo-global-er.png (Dev 2 consolida) ├── modelo-global.dbml (Dev 2 consolida) ├── script-creacion-tablas.sql (Dev 2 consolida) ├── campos-obligatorios. md (Dev 2) ├── convenciones-nomenclatura.md (Dev 2) └── /modulos ├── core-er.png (Dev 1) ├── core-er.dbml (Dev 1) ├── rrhh-er.png (Dev 2) ├── rrhh-er.dbml (Dev 2) ├── crm-er.png (Dev 3) ├── crm-er.dbml (Dev 3) ├── alm-er.png (Dev 4) ├── alm-er.dbml (Dev 4) ├── bpm-er.png (Dev 5) ├── bpm-er.dbml (Dev 5) ├── erp-er. png (Dev 5) ├── erp-er.dbml (Dev 5) ├── soporte-er.png (Dev 6) └── soporte-er.dbml (Dev 6)

/api ├── convenciones-api.md (Dev 3) ├── catalogo-endpoints.md (Dev 3 consolida) └── /modulos ├── core-endpoints.md (Dev 1) ├── rrhh-endpoints.md (Dev 2) ├── crm-endpoints.md (Dev 3) ├── alm-endpoints.md (Dev 4) ├── bpm-endpoints.md (Dev 5) ├── erp-endpoints.md (Dev 5) ├── soporte-endpoints.md (Dev 6) └── bi-endpoints.md (Dev 6)

/integraciones ├── documento-integraciones.md (Dev 4 consolida) ├── matriz-integraciones.md (Dev 4) ├── diagrama-flujo-datos.png (Dev 4) └── secuencia-desarrollo.md (Dev 4)

/arquitectura ├── arquitectura-backend.md (Dev 1) ├── estructura-carpetas.md (Dev 1) └── convenciones-codigo.md (Dev 1)

/equipo ├── organizacion-equipo.md (Dev 1) └── metodologia-trabajo.md (Dev 1)

/coordinacion └── acuerdos-frontend-backend.md (Dev 3)

/templates ├── plantilla-descripcion-modulo.md (Dev 1) ├── plantilla-entidades. md (Dev 1) └── plantilla-endpoints.md (Dev 1)


---

## 📋 Tareas Comunes para TODOS

Cada desarrollador debe crear para su(s) módulo(s):

### 1. Descripción del Módulo
Archivo: `docs/modulos/[modulo]-descripcion.md`

**Contenido**:
- Finalidad del módulo
- Funcionalidades principales (5-10 funcionalidades)
- Usuarios que lo utilizan (roles)
- Datos que gestiona (entidades)
- Problemas que resuelve
- Métricas para BI

### 2. Entidades del Módulo
Archivo: `docs/modulos/[modulo]-entidades.md`

**Para cada entidad documentar**:
- Nombre de la tabla
- Descripción
- Campos (nombre, tipo, nullable, clave, descripción)
- Campos obligatorios del sistema (`empresa_id`, `created_at`, `updated_at`, etc.)
- Relaciones con otras entidades (internas y externas)
- Reglas de negocio

### 3. Diagrama ER
Archivos: `docs/database/modulos/[modulo]-er. png` y `[modulo]-er.dbml`

**Herramienta**: [dbdiagram.io](https://dbdiagram.io)

**Debe incluir**:
- Todas las entidades del módulo
- Campos con tipos de datos
- Claves primarias (PK) y foráneas (FK)
- Relaciones internas del módulo
- Relaciones con otros módulos (con notas)
- Campos obligatorios (`empresa_id`, `created_at`, etc.)

**Exportar**:
- PNG (para documentación)
- DBML (código)

### 4. Endpoints API
Archivo: `docs/api/modulos/[modulo]-endpoints.md`

**Para cada entidad principal documentar**:
- `GET /api/v1/[modulo]/[entidad]` - Listar
- `GET /api/v1/[modulo]/[entidad]/: id` - Obtener uno
- `POST /api/v1/[modulo]/[entidad]` - Crear
- `PUT /api/v1/[modulo]/[entidad]/:id` - Actualizar
- `DELETE /api/v1/[modulo]/[entidad]/:id` - Eliminar

**Incluir para cada endpoint**:
- Descripción
- Autenticación requerida (Bearer Token)
- Permisos necesarios (roles)
- Parámetros (query, path, body)
- Ejemplo de respuesta exitosa
- Códigos de error posibles

### 5. Integraciones
Archivo: `docs/modulos/[modulo]-integraciones.md`

**Documentar**:
- **Datos que CONSUME de otros módulos**
  - Tabla:  Módulo origen | Entidad | Propósito | Campo FK
- **Datos que EXPONE a otros módulos**
  - Tabla: Módulo destino | Entidad | Propósito | Campo FK
- **Eventos que podría emitir** (para futura implementación)

---

## 🛠️ Herramientas Recomendadas

- **GitHub**:  Repositorio y control de versiones
- **GitHub Projects**: Gestión de tareas (Kanban)
- **GitHub Issues**: Tracking de tareas individuales
- **dbdiagram.io**: Creación de diagramas ER
- **Miro / Draw.io**: Diagramas de flujo e integraciones
- **Slack / Discord**: Comunicación diaria
- **Google Docs / Notion**: Documentación colaborativa (opcional)
- **Markdown**: Formato de documentación

---

## ✅ Entregables Finales del Sprint 1

### Documentos Principales

1. **Documento de Análisis del Producto** (`docs/producto/analisis-producto.md`)
2. **Documentos de Descripción de Módulos** (8 archivos en `docs/modulos/`)
3. **Modelo de Datos Global** (`docs/database/modelo-global-er. png` + SQL)
4. **Documento de Integraciones** (`docs/integraciones/documento-integraciones. md`)
5. **Organización del Equipo** (`docs/equipo/organizacion-equipo.md`)

### Criterios de Evaluación

- ✅ Claridad en la documentación
- ✅ Coherencia entre módulos
- ✅ Correcta definición de relaciones de datos
- ✅ Visión realista de empresa
- ✅ Trabajo colaborativo y organizado

---

## 📞 Coordinación

### Reuniones
- **Viernes**: 6 horas presenciales (todo el equipo)
- **Daily virtual** (opcional): Lunes y miércoles, 15 min

### Comunicación
- **Canal Slack/Discord**:  `#backend-sprint1`
- **GitHub Issues**: Para tracking de tareas
- **GitHub Discussions**: Para decisiones técnicas

### Compartir Avances
- Subir documentación a GitHub conforme se vaya completando
- Etiquetar en Slack cuando se complete una tarea importante
- Pedir feedback temprano (no esperar al viernes)

---

## 🎯 Próximos Pasos

1. **Semana 1**: Trabajo individual en módulos asignados
2. **Viernes Semana 2**: Consolidación de entregables
3. **Entrega final**: Lunes siguiente al segundo viernes

---

## 📝 Notas Importantes

- **No se desarrolla código** en este sprint, solo documentación
- **Usar plantillas** creadas por Dev 1 para mantener consistencia
- **Comunicación proactiva**:  Si tienes dudas, pregunta al equipo
- **Revisión cruzada**: Revisar documentos de otros desarrolladores
- **Campos obligatorios**:  TODAS las tablas deben incluir `empresa_id`, `created_at`, `updated_at`

---

**¡Éxito en el Sprint 1!** 🚀
