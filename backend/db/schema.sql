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
