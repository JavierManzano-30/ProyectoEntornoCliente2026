# 📌 Funcionalidades Principales del Módulo CRM

El módulo de **CRM (Customer Relationship Management)** proporciona las funcionalidades necesarias para gestionar de forma centralizada, segura y auditable la información relacionada con la **relación comercial** de la empresa con sus clientes actuales y potenciales.  
Actúa como módulo crítico y transversal, siendo proveedor principal de datos comerciales para el resto del sistema.

Cada funcionalidad está diseñada teniendo en cuenta su integración directa con otros módulos, evitando duplicidad de información y garantizando coherencia global.

---

## 1. 🏢 Gestión centralizada de clientes (leads y cuentas)

El módulo CRM gestiona la **entidad cliente** como núcleo del sistema comercial, centralizando la información necesaria para el funcionamiento del resto de módulos.

### Esta funcionalidad permite:
- Alta, actualización y consulta de clientes.
- Diferenciación entre Leads (prospectos) y Clientes activos.
- Gestión del estado comercial y nivel de interés.
- Asignación de responsable comercial.
- Aislamiento estricto por empresa en entornos multiempresa.
- Conservación del histórico completo (no se eliminan clientes físicamente).

### 🔗 Integración con otros módulos
- **CORE:** CRM consume empresas y usuarios, pero no gestiona autenticación.
- **ERP:** Sincroniza clientes para facturación y gestión de pedidos.
- **ALM:** Asocia clientes a proyectos de servicios.
- **Soporte:** Vincula tickets con clientes para visión 360°.
- **BI:** Consume datos para métricas de cartera de clientes.

---

## 2. 👥 Registro y gestión de contactos

CRM define y mantiene el **registro de personas físicas** asociadas a las empresas cliente.

### Esta funcionalidad permite:
- Crear y gestionar contactos por cliente.
- Identificar contactos decisores y roles clave.
- Centralizar información de comunicación (email, teléfono, LinkedIn).
- Garantizar integridad y trazabilidad de datos de contacto.

### 🔗 Integración con otros módulos
- **ERP:** Usa contactos como receptores de facturas y comunicaciones.
- **Soporte:** Vincula tickets con contactos específicos del cliente.
- **BI:** Analiza red de contactos por cliente.

---

## 3. 📊 Pipeline de ventas y gestión de oportunidades

Gestiona el **ciclo de vida de las ventas**, desde la cualificación inicial hasta el cierre.

### Permite:
- Crear y configurar múltiples pipelines de venta.
- Definir fases personalizadas por tipo de venta.
- Gestionar oportunidades con valoración y probabilidad de cierre.
- Mover oportunidades entre fases (Kanban).
- Prever ingresos basados en valor y probabilidad.

### 🔗 Integración con otros módulos
- **ERP:** Al cerrar una oportunidad ganada, genera automáticamente pedidos/facturas.
- **ALM:** Crea proyectos automáticamente al cerrar oportunidades de servicios.
- **BI:** Métricas de pipeline, conversión y previsión de ingresos.

---

## 4. 📞 Seguimiento de actividades comerciales

CRM gestiona el **historial de interacciones** con clientes y prospectos.

### Permite:
- Registrar actividades de diferentes tipos (llamadas, emails, reuniones).
- Vincular actividades a clientes, oportunidades y contactos.
- Gestionar agenda y tareas pendientes.
- Mantener histórico completo de comunicaciones.

### 🔗 Integración con otros módulos
- **Soporte:** Comparte historial de comunicaciones con clientes.
- **BI:** Métricas de actividad comercial por usuario.
- **RRHH:** Datos para evaluación de desempeño de comerciales.

---

## 5. 🔄 Conversión automatizada de leads a clientes

CRM permite el **flujo de conversión** para transformar prospectos en clientes activos.

### Permite:
- Convertir leads calificados en cuentas cliente con un clic.
- Activar automáticamente funcionalidades de ERP (facturación).
- Mantener trazabilidad del proceso de conversión.
- Generar automáticamente una primera oportunidad.

### 🔗 Integración con otros módulos
- **ERP:** Activa el cliente en el módulo de facturación.
- **Soporte:** Habilita soporte prioritario para clientes activos.
- **BI:** Métricas de tasa de conversión lead-to-customer.

---

## 6. 📈 Dashboard comercial y métricas de ventas

CRM expone **indicadores clave de rendimiento comercial** en tiempo real.

### Permite:
- Visualizar valor total del pipeline por fase.
- Calcular tasas de conversión.
- Analizar actividades por comercial.
- Prever ingresos futuros.
- Comparar rendimiento entre periodos.

### 🔗 Integración con otros módulos
- **BI:** Consume todas las métricas para análisis avanzado y reporting ejecutivo.
- **ERP:** Compara pipeline previsto vs facturación real.
- **RRHH:** Provee datos para sistemas de incentivos.

---

## 7. 🔄 Exposición de datos normalizados a módulos transversales

CRM actúa como **proveedor principal de datos comerciales**, exponiendo información consistente mediante APIs y eventos de dominio.

### 🔗 Integración con otros módulos
- **ERP:** Datos de clientes para facturación y cobros.
- **ALM:** Información de cliente para proyectos.
- **Soporte:** Datos de contexto comercial del cliente.
- **BI:** Analítica comercial y métricas estratégicas.

Toda la exposición respeta el aislamiento multiempresa y los controles de acceso.

---

## 8. 🛡️ Auditoría y trazabilidad de cambios en información comercial

Todas las entidades del módulo CRM incorporan **auditoría y trazabilidad**, esenciales para cumplimiento y control comercial.

### Se garantiza:
- Registro de autor y fecha de cada cambio.
- Conservación histórica de datos críticos (cambios de fase, actualizaciones de valor).
- Control de accesos basado en roles.

### 🔗 Integración con otros módulos
- **CORE:** Proporciona identidad y roles para permisos.
- **BI:** Usa datos históricos para análisis de evolución comercial.
