# 📌 Funcionalidades Principales del Módulo ERP

El módulo de **Enterprise Resource Planning (ERP)** concentra los procesos financieros, logísticos y operativos de la empresa, convirtiéndose en la fuente única de datos económicos para el resto de módulos.  
Todas las funcionalidades han sido diseñadas para operar en entornos multiempresa, con trazabilidad completa y un fuerte alineamiento con BPM, RRHH, ALM y BI.

---

## 1. 📚 Contabilidad general y libro mayor

Gestiona el plan contable, asientos, periodos y cierres reglamentarios.

### Esta funcionalidad permite:
- Definir planes contables multiempresa y multimoneda.  
- Registrar asientos automáticos/manuales con controles de doble partida.  
- Ejecutar cierres mensuales/anuales y reversiones auditables.  
- Consolidar estados financieros por empresa o grupo.

### 🔗 Integración con otros módulos
- **BPM:** dispara workflows de aprobación de cierres o ajustes.  
- **RRHH:** recibe nóminas y costes para imputaciones contables.  
- **BI:** consume balances y resultados para tableros financieros.  
- **CORE:** usa divisas y calendarios corporativos.

---

## 2. 🛒 Compras y gestión de proveedores

Controla el ciclo completo de abastecimiento, desde solicitudes hasta pagos.

### Esta funcionalidad permite:
- Registrar proveedores con homologación y scoring.  
- Gestionar solicitudes, órdenes de compra y recepciones.  
- Validar facturas contra recepciones (3-way match).  
- Controlar compromisos presupuestarios y previsiones de pago.

### 🔗 Integración con otros módulos
- **BPM:** maneja aprobaciones multi-nivel de compras.  
- **ERP Inventario:** actualiza existencias tras recepciones.  
- **Soporte / ALM:** solicitan materiales, licencias o servicios.  
- **BI:** analiza gastos por proveedor o categoría.

---

## 3. 💼 Ventas, facturación y cuentas por cobrar

Administra pedidos de clientes, generación de facturas y seguimiento de cobros.

### Esta funcionalidad permite:
- Registrar pedidos multi-canal y verificar disponibilidad.  
- Emitir facturas electrónicas o físicas según normativa.  
- Gestionar notas de crédito/débito y ajustes comerciales.  
- Controlar cartera, ageing y recordatorios de cobranza.

### 🔗 Integración con otros módulos
- **CRM / ALM:** envían oportunidades y proyectos cerrados.  
- **BPM:** orquesta aprobaciones de descuentos y condiciones especiales.  
- **BI:** reporta ingresos, márgenes y forecast.  
- **Tesorería:** recibe calendarios de cobro para conciliación.

---

## 4. 📦 Inventario y almacenes

Mantiene el control detallado de artículos, ubicaciones, lotes y movimientos.

### Esta funcionalidad permite:
- Gestionar catálogos, listas de materiales y atributos técnicos.  
- Controlar existencias en múltiples almacenes y ubicaciones.  
- Rastrear lotes/series para trazabilidad regulatoria.  
- Ejecutar conteos cíclicos y valoraciones de stock.

### 🔗 Integración con otros módulos
- **Compras/Ventas:** sincroniza recepciones, transferencias y despachos.  
- **Producción:** reserva materiales y registra consumos.  
- **BPM:** automatiza flujos de reabastecimiento y ajustes.  
- **BI:** mide rotación y cobertura para decisiones de supply chain.

---

## 5. 🏭 Planificación y control de producción

Coordina las órdenes de fabricación, recursos y consumos necesarios para producir bienes o servicios.

### Esta funcionalidad permite:
- Generar órdenes de trabajo a partir de demanda o planes maestros.  
- Gestionar listas de materiales y rutas operativas.  
- Registrar avances, mermas y tiempos de máquina/persona.  
- Calcular costes estándar y reales por lote o unidad.

### 🔗 Integración con otros módulos
- **RRHH:** obtiene disponibilidad de personal especializado.  
- **ALM:** recibe configuraciones para productos personalizados.  
- **BPM:** automatiza aprobaciones de cambios en ingeniería.  
- **BI:** analiza eficiencia, OEE y desviaciones de coste.

---

## 6. 📊 Gestión de proyectos y centros de coste

Permite seguir de forma integral los proyectos internos/externos y su impacto financiero.

### Esta funcionalidad permite:
- Crear proyectos con presupuestos, hitos y centros de beneficio.  
- Registrar imputaciones de costes (materiales, tiempo, servicios).  
- Comparar presupuesto vs. real en tiempo real.  
- Generar informes de rentabilidad por proyecto.

### 🔗 Integración con otros módulos
- **RRHH:** recibe horas imputadas y tarifas desde evaluaciones.  
- **ALM / BPM:** sincroniza etapas y entregables aprobados.  
- **BI:** consolida KPIs de rentabilidad y avance.  
- **Tesorería:** planifica flujos de cobro/pago asociados.

---

## 7. 💳 Tesorería, bancos y conciliaciones

Gestiona el flujo de caja, las relaciones bancarias y las conciliaciones diarias.

### Esta funcionalidad permite:
- Administrar cuentas bancarias, préstamos y tarjetas corporativas.  
- Generar previsiones de caja con escenarios.  
- Conciliar movimientos bancarios de forma automática/asistida.  
- Controlar autorizaciones de pagos y transferencias.

### 🔗 Integración con otros módulos
- **Compras/Ventas:** reciben estados de pago/cobro confirmados.  
- **BPM:** ejecuta aprobaciones previas a liberar fondos.  
- **BI:** monitorea liquidez y exposición a riesgos.  
- **CORE:** utiliza catálogos de divisas y tipos de cambio.

---

## 8. 📑 Reporting financiero y cumplimiento regulatorio

El ERP consolida toda la información para generar informes internos y regulatorios.

### Esta funcionalidad asegura:
- Generación de estados financieros, libros legales y declaraciones fiscales.  
- Gestión de anexos requeridos por auditoría o entes regulatorios.  
- Configuración de reglas de retención y percepciones.  
- Publicación de datasets certificados para BI y auditores.

### 🔗 Integración con otros módulos
- **BI:** consume datasets certificados para tableros estratégicos.  
- **BPM:** controla las aprobaciones previas al envío de reportes.  
- **RRHH / ALM / CRM:** aportan datos complementarios (plantillas, proyectos, ventas).  
- **Compliance:** accede a evidencia y bitácoras para revisiones.
