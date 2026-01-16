# 📌 Funcionalidades Principales del Módulo RRHH

El módulo de **Recursos Humanos (RRHH)** proporciona las funcionalidades necesarias para gestionar de forma centralizada, segura y auditable la información relacionada con las personas que trabajan en una empresa.  
Actúa como módulo base y transversal, siendo proveedor principal de datos laborales para el resto del sistema.

Cada funcionalidad está diseñada teniendo en cuenta su integración directa con otros módulos, evitando duplicidad de información y garantizando coherencia global.

---

## 1. 👥 Gestión centralizada de empleados y datos laborales

El módulo RRHH gestiona la **entidad empleado** como núcleo del sistema, centralizando la información personal y laboral necesaria para el funcionamiento del resto de módulos.

### Esta funcionalidad permite:
- Alta, actualización y consulta de empleados.
- Gestión del estado laboral (activo, baja, suspendido).
- Asociación opcional con usuarios del módulo CORE.
- Aislamiento estricto por empresa en entornos multiempresa.
- Conservación del histórico completo (no se eliminan empleados físicamente).

### 🔗 Integración con otros módulos
- **CORE:** RRHH consume empresas y usuarios, pero no gestiona autenticación ni credenciales.
- **ALM:** Consume empleados activos para asignación a proyectos y equipos.
- **BPM:** Consume empleados como responsables y aprobadores en flujos de negocio.
- **Soporte:** Consume empleados como identidad del solicitante de incidencias internas.
- **BI:** Consume datos para métricas de headcount, rotación y antigüedad.

---

## 2. 🏢 Administración de departamentos y estructura organizativa

RRHH define y mantiene la **estructura organizativa formal** de la empresa mediante departamentos jerárquicos.

### Esta funcionalidad permite:
- Crear y gestionar departamentos por empresa.
- Definir jerarquías organizativas.
- Asignar empleados a unidades organizativas.
- Garantizar integridad y trazabilidad de cambios organizativos.

### 🔗 Integración con otros módulos
- **BPM:** Usa la estructura para responsables y circuitos de aprobación.
- **ERP:** Consume departamentos para imputación y análisis de costes salariales.
- **ALM:** Usa departamentos como referencia organizativa para equipos.
- **BI:** Consume información para análisis de distribución de personal.

---

## 3. 📄 Gestión de contratos laborales y su vigencia

Gestiona las **condiciones contractuales y económicas** de los empleados, manteniendo un historial completo.

### Permite:
- Registrar contratos laborales.
- Controlar vigencia y finalización.
- Gestionar cambios contractuales a lo largo del tiempo.
- Evitar contratos activos solapados para un mismo empleado.

### 🔗 Integración con otros módulos
- **ERP:** Consume información contractual y salarial para procesos financieros.
- **BPM:** Usa contratos en flujos de altas, renovaciones o modificaciones.
- **BI:** Consume histórico contractual para análisis de costes laborales.
- **ALM:** Valida asignaciones según estado contractual.

---

## 4. 🗓️ Registro y control de ausencias, bajas y vacaciones

RRHH gestiona la **indisponibilidad temporal** de los empleados, diferenciando tipos de ausencia y estados.

### Permite:
- Registrar solicitudes de ausencia.
- Gestionar estados (pendiente, aprobada, rechazada).
- Controlar solapamientos y coherencia temporal.
- Mantener histórico completo (no se eliminan ausencias).

### 🔗 Integración con otros módulos
- **BPM:** Gestión de flujos de solicitud y aprobación.
- **ALM:** Consume disponibilidad para planificación de tareas.
- **BI:** Métricas de ausentismo y análisis temporal.
- **Soporte:** Usa estado del empleado para incidencias internas.

---

## 5. 💰 Generación y almacenamiento de nóminas

RRHH **almacena y gobierna** los resultados del cálculo salarial (pero no realiza el cálculo financiero).

### Permite:
- Registrar nóminas por empleado y periodo.
- Mantener histórico salarial.
- Exponer información agregada de costes.
- Garantizar inmutabilidad: una nómina no se modifica, se corrige con nuevos registros.

### 🔗 Integración con otros módulos
- **ERP:** Contabilidad, pagos y reporting financiero.
- **BI:** Análisis de costes y evolución salarial.
- **Dirección financiera:** Accede a través de ERP o BI.

---

## 6. ⭐ Evaluaciones de desempeño y seguimiento histórico

RRHH permite registrar **evaluaciones periódicas de desempeño**, asociadas a empleados y fechas concretas.

### Esta funcionalidad:
- Mantiene un histórico completo.
- Normaliza resultados.
- Restringe acceso según rol.
- No sobrescribe evaluaciones anteriores.

### 🔗 Integración con otros módulos
- **BPM:** Procesos de feedback, revisión y mejora.
- **BI:** Métricas agregadas de desempeño.
- **ALM:** Información indirecta para gestión de talento y equipos.

---

## 7. 🔄 Exposición de datos normalizados a módulos transversales

RRHH actúa como **proveedor principal de datos laborales**, exponiendo información consistente mediante APIs y eventos de dominio.

### 🔗 Integración con otros módulos
- **ERP:** Costes salariales y nóminas.
- **BPM:** Responsables, aprobadores y flujos humanos.
- **ALM:** Empleados asignables a proyectos.
- **Soporte:** Identificación de empleados internos.
- **BI:** Analítica de personal y métricas estratégicas.

Toda la exposición respeta el aislamiento multiempresa y los controles de acceso.

---

## 8. 🛡️ Auditoría y trazabilidad de cambios en información sensible

Todas las entidades del módulo RRHH incorporan **auditoría y trazabilidad**, esenciales en entornos empresariales.

### Se garantiza:
- Registro de autor y fecha de cada cambio.
- Conservación histórica de datos críticos.
- Control de accesos basado en roles.

### 🔗 Integración con otros módulos
- **CORE:** Proporciona identidad y roles para permisos.
- **BPM:** Consume eventos auditables en procesos de control.
- **BI:** Usa datos históricos para auditorías internas y cumplimiento.

