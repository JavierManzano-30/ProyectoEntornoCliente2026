-- ================================
-- MÓDULO ALM
-- ================================

CREATE TABLE IF NOT EXISTS alm_proyectos (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  responsable_id TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('planificacion', 'en_curso', 'pausado', 'completado')),
  presupuesto NUMERIC,
  cliente_id TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS alm_tareas (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  proyecto_id TEXT NOT NULL REFERENCES alm_proyectos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'en_progreso', 'completada')),
  prioridad TEXT NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta')),
  asignado_a TEXT,
  fecha_vencimiento DATE,
  tiempo_estimado INTEGER,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS alm_registro_horas (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  tarea_id TEXT NOT NULL REFERENCES alm_tareas(id) ON DELETE CASCADE,
  usuario_id TEXT NOT NULL,
  fecha DATE NOT NULL,
  horas NUMERIC NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_alm_proyectos_empresa ON alm_proyectos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_alm_tareas_proyecto ON alm_tareas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_alm_tareas_empresa ON alm_tareas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_alm_registro_tarea ON alm_registro_horas(tarea_id);
CREATE INDEX IF NOT EXISTS idx_alm_registro_usuario ON alm_registro_horas(usuario_id);

-- ================================
-- MÓDULO CRM
-- ================================

CREATE TABLE IF NOT EXISTS crm_clientes (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  cif TEXT,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  ciudad TEXT,
  responsable_id TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('lead', 'cliente')),
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_contactos (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL REFERENCES crm_clientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellidos TEXT,
  cargo TEXT,
  email TEXT,
  telefono TEXT,
  es_decisor BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_pipelines (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_fases (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  pipeline_id TEXT NOT NULL REFERENCES crm_pipelines(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  orden INTEGER NOT NULL,
  probabilidad_defecto INTEGER DEFAULT 0 CHECK (probabilidad_defecto >= 0 AND probabilidad_defecto <= 100),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_oportunidades (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL REFERENCES crm_clientes(id) ON DELETE CASCADE,
  pipeline_id TEXT NOT NULL REFERENCES crm_pipelines(id) ON DELETE RESTRICT,
  fase_id TEXT NOT NULL REFERENCES crm_fases(id) ON DELETE RESTRICT,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  valor_estimado NUMERIC DEFAULT 0,
  moneda TEXT DEFAULT 'EUR',
  probabilidad INTEGER DEFAULT 0 CHECK (probabilidad >= 0 AND probabilidad <= 100),
  fecha_cierre_prevista DATE,
  responsable_id TEXT,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_actividades (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  usuario_id TEXT NOT NULL,
  cliente_id TEXT REFERENCES crm_clientes(id) ON DELETE CASCADE,
  oportunidad_id TEXT REFERENCES crm_oportunidades(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('llamada', 'email', 'reunion', 'nota')),
  asunto TEXT NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMPTZ NOT NULL,
  fecha_vencimiento TIMESTAMPTZ,
  completada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_crm_clientes_empresa ON crm_clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_crm_clientes_tipo ON crm_clientes(tipo);
CREATE INDEX IF NOT EXISTS idx_crm_clientes_responsable ON crm_clientes(responsable_id);
CREATE INDEX IF NOT EXISTS idx_crm_contactos_cliente ON crm_contactos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_crm_contactos_empresa ON crm_contactos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_crm_pipelines_empresa ON crm_pipelines(empresa_id);
CREATE INDEX IF NOT EXISTS idx_crm_fases_pipeline ON crm_fases(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_empresa ON crm_oportunidades(empresa_id);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_cliente ON crm_oportunidades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_pipeline ON crm_oportunidades(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_fase ON crm_oportunidades(fase_id);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_responsable ON crm_oportunidades(responsable_id);
CREATE INDEX IF NOT EXISTS idx_crm_actividades_empresa ON crm_actividades(empresa_id);
CREATE INDEX IF NOT EXISTS idx_crm_actividades_usuario ON crm_actividades(usuario_id);
CREATE INDEX IF NOT EXISTS idx_crm_actividades_cliente ON crm_actividades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_crm_actividades_oportunidad ON crm_actividades(oportunidad_id);




/* =====================================================
   MÓDULO RRHH - ESQUEMA COMPLETO DE BASE DE DATOS
   Azure SQL Server
   ===================================================== */

-- =====================================================
-- 1. Tabla: departamentos
-- =====================================================
CREATE TABLE departamentos (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    parent_department_id UNIQUEIDENTIFIER NULL,
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_parent_department
        FOREIGN KEY (parent_department_id)
        REFERENCES departamentos(id)
);

-- =====================================================
-- 2. Tabla: empleados
-- =====================================================
CREATE TABLE empleados (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    status NVARCHAR(20) NOT NULL DEFAULT 'activo',
    hire_date DATE NOT NULL,
    department_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES departamentos(id)
);

-- =====================================================
-- 3. Tabla: contratos
-- =====================================================
CREATE TABLE contratos (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    employee_id UNIQUEIDENTIFIER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    contract_type NVARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_employee_contract
        FOREIGN KEY (employee_id)
        REFERENCES empleados(id)
);

-- =====================================================
-- 4. Tabla: ausencias
-- =====================================================
CREATE TABLE ausencias (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    employee_id UNIQUEIDENTIFIER NOT NULL,
    type NVARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pendiente',
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_employee_absence
        FOREIGN KEY (employee_id)
        REFERENCES empleados(id)
);

-- =====================================================
-- 5. Tabla: nominas
-- =====================================================
CREATE TABLE nominas (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    employee_id UNIQUEIDENTIFIER NOT NULL,
    period CHAR(7) NOT NULL,
    gross_amount DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_employee_payroll
        FOREIGN KEY (employee_id)
        REFERENCES empleados(id),
    CONSTRAINT uq_employee_period
        UNIQUE (employee_id, period)
);

-- =====================================================
-- 6. Tabla: evaluaciones
-- =====================================================
CREATE TABLE evaluaciones (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    employee_id UNIQUEIDENTIFIER NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    review_date DATE NOT NULL,
    notes NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_employee_evaluation
        FOREIGN KEY (employee_id)
        REFERENCES empleados(id)
);

-- ================================
-- BI SOPORTE
-- ================================

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
