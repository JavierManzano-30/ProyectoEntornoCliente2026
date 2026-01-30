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

