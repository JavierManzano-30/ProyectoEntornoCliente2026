# 📘 Módulo ERP – Descripción General

## 1. Finalidad del módulo
El módulo de **Enterprise Resource Planning (ERP)** centraliza y estandariza la información económica, logística y operativa de la empresa.

Su objetivo es ofrecer un único libro contable y operacional que integre compras, ventas, inventario, producción y finanzas, sirviendo como fuente única de verdad para la situación económico-financiera.

En la arquitectura del backend actúa como **sistema núcleo transaccional**, consumiendo datos maestros de RRHH y CORE, y exponiendo resultados a BI, BPM y otros dominios.

---

## 2. Funcionalidades principales
1. Gestión contable y financiera multiempresa.  
2. Control de compras, proveedores y órdenes de adquisición.  
3. Administración de ventas, facturación y cuentas por cobrar.  
4. Gestión de inventario, almacenes y trazabilidad de lotes/series.  
5. Planificación de producción y control de órdenes de trabajo.  
6. Gestión de proyectos, costes y centros de beneficio.  
7. Integración con RRHH para costes laborales y con bancos/tesorería.  
8. Reporting regulatorio y cierres contables auditables.

---

## 3. Usuarios que lo utilizan
- Dirección financiera y contabilidad.  
- Responsables de compras y abastecimiento.  
- Equipos de ventas y facturación.  
- Responsables de logística e inventario.  
- Planificadores de producción / operaciones.  
- Auditores internos y externos.  
- Sistemas automáticos (BPM, BI, integraciones con entidades financieras).

---

## 4. Datos que gestiona
- **Plan contable y asientos:** cuentas, diarios, periodos, cierres.  
- **Proveedores y compras:** órdenes, recepciones, facturas y pagos.  
- **Clientes y ventas:** pedidos, entregas, facturación y cobros.  
- **Inventario:** artículos, lotes, ubicaciones, movimientos y valuaciones.  
- **Producción:** órdenes de fabricación, listas de materiales, consumos.  
- **Costes y proyectos:** centros de coste, presupuestos, imputaciones.  
- **Tesorería:** conciliaciones bancarias, previsiones, flujo de caja.  
- **Impuestos y cumplimiento:** declaraciones, tipos impositivos, retenciones.

---

## 5. Problemas que resuelve
- Dispersión de datos financieros en herramientas independientes.  
- Falta de sincronización entre compras, inventario y contabilidad.  
- Cierres contables lentos por ausencia de un ledger único.  
- Imposibilidad de rastrear costes reales de operaciones.  
- Dificultad para cumplir requisitos regulatorios y auditoría.

---

## 6. Métricas expuestas para BI
- Ingresos, costes y margen por periodo/centro de beneficio.  
- Rotación de inventario y cobertura de stock.  
- Cumplimiento de presupuesto vs. real.  
- Edad de cartera (cuentas por cobrar/pagar).  
- Coste total de producción por línea o producto.  
- Flujo de caja proyectado vs. ejecutado.  
- Indicadores de cumplimiento fiscal y retrasos en cierres.

---

## 7. Rol del módulo ERP en la arquitectura global
ERP opera como **sistema financiero y logístico central**, conectado de forma directa con:

- **CORE:** consume datos de empresas, usuarios y divisas de referencia.  
- **RRHH:** recibe costes salariales y nóminas para imputar a centros de coste.  
- **BPM:** orquesta aprobaciones de compras, pagos y cierres mediante flujos.  
- **ALM / CRM:** recibe pedidos, proyectos o contratos para facturación.  
- **Soporte:** gestiona refacturación de servicios y garantías.  
- **BI:** explota métricas contables y operativas para reporting.

Esta posición convierte al ERP en la base sobre la que se construye la visión financiera holística del negocio.

