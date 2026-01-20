# Módulo BI — Información

## 1. Finalidad
El módulo de Business Intelligence (BI) provee capacidades de análisis, visualización y reporting sobre los datos operativos de la plataforma, permitiendo a responsables y analistas tomar decisiones basadas en métricas consolidadas.

## 2. Alcance
- Dashboards de alto nivel y específicos por módulo.
- Catálogo de informes (reportes guardados) y ejecución bajo demanda o programada.
- Exposición de KPIs agregados mediante endpoints.
- Gestión de datasets y refresco/ETL básico para cuadros de mando.
- Exportación de informes (PDF, Excel) y compartición.

## 3. Usuarios que lo utilizan
- Directores y gerentes (dashboards de dirección).
- Analistas de datos (informes y datasets).
- Administradores (programación de informes y permisos).
- Consumidores automáticos (otros módulos que soliciten KPIs via API).

## 4. Datos que gestiona
- Reportes: id, nombre, descripción, autor, módulo origen, periodo, tipo de visualización, owner, cronograma.
- KPIs y métricas preagregadas (por empresa, por módulo, por periodo).
- Datasets: definiciones de extracción/transformación, esquema y estado de refresco.
- Historial de ejecuciones/exportes y permisos de acceso.

## 5. Integraciones y fuentes
- Base de datos principal (PostgreSQL) como fuente primaria.
- APIs de módulos (Soporte, ALM, BPM, ERP, RRHH, CRM) para métricas puntuales.
- Posible ingesta desde ficheros o conectores externos (CSV, S3, etc.).
- Exportación y consumo por frontend y sistemas de reporting.

## 6. Requisitos no funcionales
- Control de acceso por rol y visibilidad por empresa.
- Caching y preagregaciones para dashboards críticos.
- Programación de refrescos y registro de latencias.
- Escalabilidad para consultas analíticas y exportaciones.
- Cumplimiento de privacidad y retención de datos.

## 7. Problemas que resuelve
- Centralización de métricas y KPIs para dirección.
- Reducción del tiempo de preparación de informes manuales.
- Exposición de datos fiables para monitorización de SLA y rendimiento operacional.
