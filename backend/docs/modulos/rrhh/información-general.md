# 📘 Módulo RRHH – Descripción General

## 1. Finalidad del módulo
El módulo de **Recursos Humanos (RRHH)** tiene como finalidad centralizar, normalizar y gobernar toda la información relacionada con las personas que trabajan en una empresa.

Actúa como uno de los módulos base del sistema, ya que define entidades fundamentales (empleados, contratos, ausencias) que son consumidas transversalmente por otros módulos como **ERP, BPM, ALM y BI**.

Desde el backend, RRHH proporciona un modelo de datos estructurado, coherente y auditable para la gestión del ciclo de vida del empleado dentro de un entorno **multiempresa (multi-tenant)**.

---

## 2. Funcionalidades principales
1. Gestión centralizada de empleados y sus datos laborales.  
2. Administración de departamentos y estructura organizativa.  
3. Gestión de contratos laborales y su vigencia.  
4. Registro y control de ausencias, bajas y vacaciones.  
5. Generación y almacenamiento de nóminas.  
6. Evaluaciones de desempeño y seguimiento histórico.  
7. Exposición de datos normalizados a módulos transversales.  
8. Auditoría y trazabilidad de cambios en información sensible.

---

## 3. Usuarios que lo utilizan
- Administradores del sistema (nivel empresa).  
- Responsables de RRHH.  
- Managers / responsables de equipo.  
- Dirección financiera (consulta de nóminas).  
- Auditores internos.  
- Sistemas automáticos (integraciones internas).

---

## 4. Datos que gestiona
- **Empleados:** información personal y laboral básica.  
- **Departamentos:** estructura organizativa.  
- **Contratos:** condiciones laborales vigentes e históricas.  
- **Ausencias:** vacaciones, bajas médicas y permisos.  
- **Nóminas:** resultados de procesos de cálculo salarial.  
- **Evaluaciones:** resultados de desempeño y revisiones periódicas.

---

## 5. Problemas que resuelve
- Dispersión de datos de empleados en múltiples sistemas.  
- Falta de trazabilidad en contratos y cambios laborales.  
- Dificultad para integrar RRHH con procesos empresariales.  
- Inconsistencias en métricas de personal.  
- Ausencia de un modelo único de empleado a nivel empresa.

---

## 6. Métricas expuestas para BI
- Número total de empleados activos.  
- Rotación de personal.  
- Ausentismo por periodo.  
- Coste salarial agregado.  
- Distribución de empleados por departamento.  
- Resultados medios de evaluaciones.  
- Antigüedad media de empleados.

---

## 7. Rol del módulo RRHH en la arquitectura global
RRHH actúa como **módulo transversal y base**. Consume datos de CORE (empresas, usuarios, roles) y expone información crítica a:

- **ERP:** costes salariales y nóminas.  
- **BPM:** responsables, aprobadores y flujos.  
- **ALM:** asignación de empleados a proyectos.  
- **Soporte:** identificación de empleados como solicitantes.  
- **BI:** métricas de personal.

