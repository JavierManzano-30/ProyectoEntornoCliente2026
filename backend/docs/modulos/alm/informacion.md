# 📘 Módulo ALM – Descripción General

## 1. Finalidad del módulo
El módulo de **Application Lifecycle Management (ALM)** tiene como finalidad organizar, planificar y controlar el trabajo en proyectos, tareas y tiempos dentro de la empresa.

Actúa como un módulo operativo que conecta la estrategia (proyectos) con la ejecución (tareas), y se integra con otros módulos como **CORE, RRHH, CRM, Soporte y BI**.

Desde el backend, ALM aporta un modelo de datos estructurado para la gestión de proyectos y su avance, manteniendo trazabilidad y coherencia en entornos **multiempresa (multi-tenant)**.

---

## 2. Funcionalidades principales
1. Gestión completa de proyectos (creación, estado y seguimiento).  
2. Gestión de tareas asociadas a proyectos.  
3. Asignación de tareas a usuarios responsables.  
4. Consulta de tareas por proyecto y por estado.  
5. Registro básico de tiempos trabajados.  
6. Vínculo opcional con clientes (CRM) para proyectos externos.  
7. Exposición de datos de avance para BI.  

---

## 3. Usuarios que lo utilizan
- Administradores del sistema.  
- Managers / responsables de proyecto.  
- Usuarios asignados a tareas.  
- Dirección (seguimiento de avance y costes).  
- Sistemas internos (integraciones).  

---

## 4. Datos que gestiona
- **Proyectos:** planificación y estado del trabajo.  
- **Tareas:** unidades de ejecución dentro de proyectos.  
- **Registro de horas:** seguimiento básico de dedicación.  

---

## 5. Problemas que resuelve
- Falta de visibilidad sobre el avance de proyectos.  
- Desorganización en la asignación de tareas.  
- Dificultad para relacionar trabajo con clientes.  
- Ausencia de trazabilidad en tiempos y responsabilidades.  

---

## 6. Métricas expuestas para BI
- Proyectos en curso por empresa.  
- Tareas completadas vs pendientes.  
- Tiempo estimado vs tiempo real.  
- Productividad por usuario/proyecto.  
- Proyectos por cliente.  

---

## 7. Rol del módulo ALM en la arquitectura global
ALM actúa como **módulo operativo y de ejecución**. Consume datos base de CORE (usuarios, empresas) y se integra con:

- **RRHH:** usuarios disponibles para asignación.  
- **CRM:** proyectos asociados a clientes.  
- **Soporte:** tickets convertidos en tareas (opcional).  
- **BI:** métricas de productividad y avance.  

