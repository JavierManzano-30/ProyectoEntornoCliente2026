# Módulo BI — Funcionalidades

## Funcionalidades principales

1. Dashboards (global y por módulo)
   - Paneles con tarjetas, gráficas de líneas, barras, tarta y tablas.
   - Filtros por periodo, empresa y dimensiones clave.

2. Listado y detalle de informes
   - Catálogo de informes guardados con metadata.
   - Visualización del informe con opciones de exportar (PDF/Excel).

3. Generación y ejecución de informes
   - Ejecución bajo demanda y programación (schedules).
   - Histórico de ejecuciones y logs.

4. KPIs y métricas expuestas por API
   - Endpoints que devuelven indicadores clave para consumo por frontend u otros servicios.

5. Gestor de datasets
   - Definición de fuentes, transformaciones simples y esquema.
   - Refrescos programados y manuales.

6. Exportación y compartición
   - Exportar en varios formatos.
   - Compartir informes por enlace seguro o programar envíos por email.

7. Alertas y thresholds
   - Definición de reglas que disparan alertas cuando un KPI supera/cae bajo un umbral.
   - Notificaciones por email/in-app.

8. Seguridad y permisos
   - Control de acceso por roles y visibilidad por empresa.
   - Auditoría de accesos y descargas.

9. Integración con pipelines
   - Soporte para pre-aggregación y caches para mejorar tiempos de respuesta en dashboards críticos.

## Relaciones y flujos
- Orígenes: tablas y vistas de la BBDD principal, API de módulos, ficheros externos.
- Consumidores: frontend de BI, paneles embebidos en otros módulos, exportes automáticos.
- Dependencias: CORE (usuarios y empresas), Soporte/BPM/ALM/ERP/CRM (métricas por módulo).

## Reglas de negocio y recomendaciones de implementación
- Mantener pre-aggregaciones para KPIs frecuentes (ej. tickets por día, SLA cumplido%).
- Separar capas: extracción → transformación → visualización.
- Limitar el tiempo de retención de datos sensibles según política.
- Proveer paginación y límites en endpoints para evitar consultas pesadas desde el frontend.
