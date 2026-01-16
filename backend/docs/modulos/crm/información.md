# 📘 Módulo CRM – Descripción General

## 1. Finalidad del módulo
El módulo de **CRM (Customer Relationship Management)** tiene como finalidad centralizar, normalizar y gobernar toda la información relacionada con la **relación comercial** de la empresa con sus clientes actuales y potenciales.

Actúa como uno de los módulos críticos del sistema, ya que define entidades fundamentales (clientes, oportunidades, actividades) que impulsan el crecimiento del negocio y que son consumidas por otros módulos como **ERP, ALM, Soporte y BI**.

Desde el backend, CRM proporciona un modelo de datos estructurado, coherente y auditable para la gestión del **ciclo de vida comercial** dentro de un entorno **multiempresa (multi-tenant)**.

---

## 2. Funcionalidades principales
1. Gestión centralizada de clientes (leads y cuentas activas).  
2. Registro y gestión de contactos asociados a clientes.  
3. Pipeline de ventas configurable con gestión de oportunidades.  
4. Seguimiento de actividades comerciales (llamadas, emails, reuniones).  
5. Conversión automatizada de leads a clientes.  
6. Dashboard comercial con métricas y reportes de ventas.  
7. Exposición de datos normalizados a módulos transversales.  
8. Auditoría y trazabilidad de cambios en información comercial.

---

## 3. Usuarios que lo utilizan
- Administradores del sistema (nivel empresa).  
- Directores comerciales.  
- Managers de ventas y equipos comerciales.  
- Ejecutivos de cuentas (comerciales).  
- Dirección financiera (consulta de pipeline).  
- Sistemas automáticos (integraciones con ERP y ALM).

---

## 4. Datos que gestiona
- **Clientes:** información comercial de leads y cuentas activas.  
- **Contactos:** personas físicas asociadas a clientes.  
- **Oportunidades:** pipeline de ventas con valoración y fases.  
- **Actividades:** historial de interacciones comerciales.  
- **Pipelines y Fases:** configuración de flujos de venta personalizados.

---

## 5. Problemas que resuelve
- Dispersión de datos de clientes en múltiples sistemas (hojas Excel, emails).  
- Falta de visibilidad del estado de las oportunidades comerciales.  
- Pérdida de seguimiento de actividades con clientes.  
- Dificultad para calcular métricas comerciales (tasa de conversión, valor del pipeline).  
- Inconsistencia entre datos comerciales y de facturación (CRM vs ERP).

---

## 6. Métricas expuestas para BI
- Número total de clientes activos y leads.  
- Valor total del pipeline por fase.  
- Tasa de conversión de leads a clientes.  
- Tiempo medio de cierre de oportunidades.  
- Actividades realizadas por comercial.  
- Distribución de oportunidades por responsable.  
- Previsión de ingresos por trimestre.

---

## 7. Rol del módulo CRM en la arquitectura global
CRM actúa como **módulo de entrada comercial**. Consume datos de CORE (empresas, usuarios, roles) y expone información crítica a:

- **ERP:** sincronización de clientes y generación de facturas post-venta.  
- **ALM:** creación automática de proyectos al cerrar oportunidades de servicios.  
- **Soporte:** visión 360° del cliente (historial de tickets).  
- **RRHH:** datos para cálculo de comisiones variables.  
- **BI:** métricas comerciales y de rendimiento del equipo de ventas.
