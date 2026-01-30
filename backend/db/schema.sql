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
