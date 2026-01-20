# API — Módulo BI

Notas:
- Todas las rutas requieren autenticación y respeto del aislamiento multiempresa.
- Los endpoints devuelven datos agregados y metadatos; el uso intensivo debe pasar por caché o endpoints programados.

## KPIs y métricas
- GET  /api/v1/bi/kpis
- GET  /api/v1/bi/kpis?module={module}&from={}&to={}
- GET  /api/v1/bi/metrics/{metricId}

## Informes (Reports)
- GET  /api/v1/reports
- POST /api/v1/reports (crear informe guardado / plantilla)
- GET  /api/v1/reports/{reportId}
- PATCH /api/v1/reports/{reportId}
- DELETE /api/v1/reports/{reportId}
- POST /api/v1/reports/{reportId}/run        (ejecutar informe bajo demanda)
- GET  /api/v1/reports/{reportId}/history    (histórico de ejecuciones)
- GET  /api/v1/reports/{reportId}/export/{format}  (exportar: pdf, xlsx, csv)

## Datasets y fuentes
- GET  /api/v1/bi/datasets
- POST /api/v1/bi/datasets
- GET  /api/v1/bi/datasets/{datasetId}
- PATCH /api/v1/bi/datasets/{datasetId}
- POST /api/v1/bi/datasets/{datasetId}/refresh

## Dashboards
- GET  /api/v1/bi/dashboards
- GET  /api/v1/bi/dashboards/{dashboardId}
- POST /api/v1/bi/dashboards/{dashboardId}/snapshot

## Alertas y umbrales
- GET  /api/v1/bi/alerts
- POST /api/v1/bi/alerts
- PATCH /api/v1/bi/alerts/{alertId}
- POST /api/v1/bi/alerts/{alertId}/trigger (manual/test)

## Administración y configuración
- GET  /api/v1/bi/config
- PATCH /api/v1/bi/config

## Observaciones
- Proveer paginación y caching para endpoints de listados y KPIs.
- Los endpoints de exportación deberán respetar límites y políticas de cuota.
- Considerar endpoints de webhook/notify para entrega automática de informes programados.
