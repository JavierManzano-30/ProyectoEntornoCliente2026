==========================
 MÓDULO SOPORTE
==========================
## Tabla: support_tickets

CREATE TABLE support_tickets (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    empresa_id UNIQUEIDENTIFIER NOT NULL,
    creador_id UNIQUEIDENTIFIER NOT NULL,
    asignado_a UNIQUEIDENTIFIER NULL,

    titulo NVARCHAR(200) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,

    categoria VARCHAR(30) 
        CHECK (categoria IN ('tecnico','facturacion','otro')) NOT NULL,

    prioridad VARCHAR(20) 
        CHECK (prioridad IN ('baja','media','alta','urgente')) NOT NULL,

    estado VARCHAR(20) 
        CHECK (estado IN ('abierto','en_progreso','resuelto','cerrado')) 
        NOT NULL DEFAULT 'abierto',

    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME(),
    closed_at DATETIME2 NULL,

    sla_response_deadline DATETIME2 NULL,
    sla_resolution_deadline DATETIME2 NULL
);

## Índices Soporte (OBLIGATORIOS)

CREATE INDEX idx_support_empresa 
ON support_tickets(empresa_id);

CREATE INDEX idx_support_estado 
ON support_tickets(estado);

CREATE INDEX idx_support_asignado 
ON support_tickets(asignado_a);

CREATE INDEX idx_support_fecha 
ON support_tickets(created_at);

## Tabla: support_messages

CREATE TABLE support_messages (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    ticket_id UNIQUEIDENTIFIER NOT NULL,
    usuario_id UNIQUEIDENTIFIER NOT NULL,

    contenido NVARCHAR(MAX) NOT NULL,
    is_internal BIT DEFAULT 0,

    created_at DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT fk_message_ticket
        FOREIGN KEY (ticket_id) 
        REFERENCES support_tickets(id)
        ON DELETE CASCADE
);

## Índice Mensajes <!-- LOS INDICES SE INSERTAN COMO UNA CONSULTA NORMAL -->

CREATE INDEX idx_messages_ticket 
ON support_messages(ticket_id);

## Tabla: support_attachments

CREATE TABLE support_attachments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    ticket_id UNIQUEIDENTIFIER NOT NULL,

    file_name NVARCHAR(255),
    file_path NVARCHAR(500),
    mime_type NVARCHAR(100),
    file_size BIGINT,

    created_at DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT fk_attachment_ticket
        FOREIGN KEY (ticket_id) 
        REFERENCES support_tickets(id)
        ON DELETE CASCADE
);

## Tabla: support_audit_log (Trazabilidad obligatoria)

CREATE TABLE support_audit_log (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    ticket_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,

    action NVARCHAR(50) NOT NULL,
    old_value NVARCHAR(500),
    new_value NVARCHAR(500),

    created_at DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT fk_audit_ticket
        FOREIGN KEY (ticket_id) 
        REFERENCES support_tickets(id)
        ON DELETE CASCADE
);

## Tabla: support_sla_rules

CREATE TABLE support_sla_rules (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    categoria VARCHAR(30),
    prioridad VARCHAR(20),

    max_response_minutes INT NOT NULL,
    max_resolution_minutes INT NOT NULL
);

==========================
 MÓDULO BI
==========================
## Tabla: bi_reports

CREATE TABLE bi_reports (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(500),
    module NVARCHAR(50),

    query_definition NVARCHAR(MAX) NOT NULL,

    owner_id UNIQUEIDENTIFIER NOT NULL,
    empresa_id UNIQUEIDENTIFIER NOT NULL,

    created_at DATETIME2 DEFAULT SYSDATETIME()
);

## Tabla: bi_report_runs

CREATE TABLE bi_report_runs (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    report_id UNIQUEIDENTIFIER NOT NULL,

    status VARCHAR(30),
    output_path NVARCHAR(500),

    started_at DATETIME2,
    finished_at DATETIME2,

    CONSTRAINT fk_report_run
        FOREIGN KEY (report_id) 
        REFERENCES bi_reports(id)
        ON DELETE CASCADE
);

## Tabla: bi_datasets

CREATE TABLE bi_datasets (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    name NVARCHAR(200),
    source NVARCHAR(100),

    query_sql NVARCHAR(MAX),

    last_refresh DATETIME2
);

## Tabla: bi_alerts

CREATE TABLE bi_alerts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    empresa_id UNIQUEIDENTIFIER NOT NULL,

    metric_key NVARCHAR(100),
    condition NVARCHAR(10),
    threshold FLOAT,

    last_triggered DATETIME2 NULL,

    created_at DATETIME2 DEFAULT SYSDATETIME()
);