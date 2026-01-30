CREATE TABLE support_tickets (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    empresa_id UNIQUEIDENTIFIER NOT NULL,
    creador_id UNIQUEIDENTIFIER NOT NULL,
    asignado_a UNIQUEIDENTIFIER NULL,

    titulo NVARCHAR(200) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,

    categoria VARCHAR(30) NOT NULL
        CHECK (categoria IN ('tecnico','facturacion','otro')),

    prioridad VARCHAR(20) NOT NULL
        CHECK (prioridad IN ('baja','media','alta','urgente')),

    estado VARCHAR(20) NOT NULL DEFAULT 'abierto'
        CHECK (estado IN ('abierto','en_progreso','resuelto','cerrado')),

    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME(),
    closed_at DATETIME2 NULL,

    sla_response_deadline DATETIME2 NULL,
    sla_resolution_deadline DATETIME2 NULL
);
GO


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
GO


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
GO


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
GO


CREATE TABLE support_sla_rules (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    categoria VARCHAR(30),
    prioridad VARCHAR(20),

    max_response_minutes INT NOT NULL,
    max_resolution_minutes INT NOT NULL
);
GO




CREATE INDEX idx_support_empresa
ON support_tickets(empresa_id);
GO

CREATE INDEX idx_support_estado
ON support_tickets(estado);
GO

CREATE INDEX idx_support_asignado
ON support_tickets(asignado_a);
GO

CREATE INDEX idx_support_fecha
ON support_tickets(created_at);
GO

CREATE INDEX idx_support_empresa_estado
ON support_tickets(empresa_id, estado);
GO

CREATE INDEX idx_messages_ticket
ON support_messages(ticket_id);
GO




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
GO


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
GO


CREATE TABLE bi_datasets (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    name NVARCHAR(200),
    source NVARCHAR(100),

    query_sql NVARCHAR(MAX),

    last_refresh DATETIME2
);
GO


CREATE TABLE bi_alerts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    empresa_id UNIQUEIDENTIFIER NOT NULL,

    metric_key NVARCHAR(100),
    condition NVARCHAR(10),
    threshold FLOAT,

    last_triggered DATETIME2 NULL,

    created_at DATETIME2 DEFAULT SYSDATETIME()
);
GO




CREATE INDEX idx_bi_reports_empresa
ON bi_reports(empresa_id);
GO

CREATE INDEX idx_bi_alerts_empresa
ON bi_alerts(empresa_id);
GO



