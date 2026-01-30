CREATE TABLE IF NOT EXISTS bpm_procesos (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  version INT NOT NULL DEFAULT 1,
  estado TEXT NOT NULL CHECK (estado IN ('activo', 'inactivo', 'archivado')),
  flujo_json JSONB,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_actividades (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  proceso_id TEXT NOT NULL REFERENCES bpm_procesos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('tarea', 'puerta_decision', 'evento', 'espera')),
  orden INT NOT NULL,
  asignado_a_role TEXT,
  tiempo_limite_horas INT,
  required_docs JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_aprobaciones (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  proceso_id TEXT NOT NULL REFERENCES bpm_procesos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  tipo_documento TEXT,
  nivel INT NOT NULL,
  aprobadores_requeridos INT NOT NULL,
  sla_horas INT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_solicitudes_aprobacion (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  aprobacion_id TEXT NOT NULL REFERENCES bpm_aprobaciones(id) ON DELETE CASCADE,
  referencia_id TEXT,
  referencia_tipo TEXT,
  solicitante_id TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'en_revision')),
  prioridad TEXT NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta')),
  fecha_vencimiento TIMESTAMPTZ,
  fecha_inicio TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_respuestas_aprobacion (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  solicitud_id TEXT NOT NULL REFERENCES bpm_solicitudes_aprobacion(id) ON DELETE CASCADE,
  aprobador_id TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('aprobado', 'rechazado', 'pendiente')),
  comentarios TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_instancias_proceso (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  proceso_id TEXT NOT NULL REFERENCES bpm_procesos(id) ON DELETE CASCADE,
  referencia_id TEXT,
  referencia_tipo TEXT,
  proyecto_alm_id TEXT,
  tarea_alm_id TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('iniciado', 'en_curso', 'completado', 'cancelado', 'error')),
  progreso_porcentaje INT DEFAULT 0,
  iniciado_por TEXT NOT NULL,
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_tareas_proceso (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  instancia_id TEXT NOT NULL REFERENCES bpm_instancias_proceso(id) ON DELETE CASCADE,
  actividad_id TEXT NOT NULL REFERENCES bpm_actividades(id) ON DELETE CASCADE,
  tarea_alm_id TEXT,
  asignado_a TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'rechazada')),
  fecha_vencimiento TIMESTAMPTZ,
  fecha_inicio TIMESTAMPTZ,
  fecha_completacion TIMESTAMPTZ,
  resultado_json JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_documentos (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  instancia_id TEXT NOT NULL REFERENCES bpm_instancias_proceso(id) ON DELETE CASCADE,
  nombre_archivo TEXT NOT NULL,
  tipo_documento TEXT,
  tamano BIGINT,
  url_almacenamiento TEXT,
  usuario_id TEXT NOT NULL,
  clasificacion TEXT,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_comentarios (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  instancia_id TEXT NOT NULL REFERENCES bpm_instancias_proceso(id) ON DELETE CASCADE,
  usuario_id TEXT NOT NULL,
  contenido TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_auditoria (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  proceso_id TEXT NOT NULL REFERENCES bpm_procesos(id) ON DELETE CASCADE,
  instancia_id TEXT,
  usuario_id TEXT,
  accion TEXT NOT NULL,
  detalles JSONB,
  created_at TIMESTAMPTZ NOT NULL
);


CREATE TABLE IF NOT EXISTS erp_productos (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  codigo_producto TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria_id TEXT,
  precio_costo NUMERIC NOT NULL,
  precio_venta NUMERIC NOT NULL,
  margen_ganancia NUMERIC,
  unidad_medida TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('activo', 'inactivo', 'discontinuado')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_categorias_producto (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_inventario (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  producto_id TEXT NOT NULL REFERENCES erp_productos(id) ON DELETE CASCADE,
  almacen_id TEXT NOT NULL,
  cantidad_disponible NUMERIC NOT NULL DEFAULT 0,
  cantidad_reservada NUMERIC NOT NULL DEFAULT 0,
  cantidad_minima NUMERIC NOT NULL,
  cantidad_maxima NUMERIC NOT NULL,
  fecha_ultimo_movimiento TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_almacenes (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  ubicacion TEXT,
  capacidad_total NUMERIC,
  responsable_id TEXT,
  tipo TEXT CHECK (tipo IN ('principal', 'secundario', 'transitorio')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_ordenes_compra (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  proveedor_id TEXT NOT NULL,
  numero_orden TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL CHECK (estado IN ('borrador', 'confirmada', 'recibida_parcial', 'recibida', 'cancelada')),
  fecha_pedido DATE NOT NULL,
  fecha_entrega_esperada DATE,
  fecha_entrega_real DATE,
  total NUMERIC NOT NULL,
  moneda TEXT DEFAULT 'COP',
  comentarios TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_items_compra (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  orden_compra_id TEXT NOT NULL REFERENCES erp_ordenes_compra(id) ON DELETE CASCADE,
  producto_id TEXT NOT NULL REFERENCES erp_productos(id) ON DELETE CASCADE,
  cantidad_pedida NUMERIC NOT NULL,
  cantidad_recibida NUMERIC DEFAULT 0,
  precio_unitario NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_ordenes_venta (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  cliente_id TEXT NOT NULL,
  numero_orden TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL CHECK (estado IN ('cotizacion', 'confirmada', 'empaquetada', 'enviada', 'entregada', 'cancelada')),
  fecha_pedido DATE NOT NULL,
  fecha_entrega_esperada DATE,
  fecha_entrega_real DATE,
  subtotal NUMERIC NOT NULL,
  impuesto NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  moneda TEXT DEFAULT 'COP',
  condicion_pago TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_items_venta (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  orden_venta_id TEXT NOT NULL REFERENCES erp_ordenes_venta(id) ON DELETE CASCADE,
  producto_id TEXT NOT NULL REFERENCES erp_productos(id) ON DELETE CASCADE,
  cantidad NUMERIC NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  descuento_porcentaje NUMERIC DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_facturas (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  orden_venta_id TEXT REFERENCES erp_ordenes_venta(id) ON DELETE SET NULL,
  cliente_id TEXT NOT NULL,
  numero_factura TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL CHECK (estado IN ('borrador', 'emitida', 'anulada', 'pagada')),
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE,
  fecha_pago DATE,
  subtotal NUMERIC NOT NULL,
  impuesto_porcentaje NUMERIC,
  impuesto_monto NUMERIC,
  total NUMERIC NOT NULL,
  moneda TEXT DEFAULT 'COP',
  notas TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_movimientos_inventario (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  producto_id TEXT NOT NULL REFERENCES erp_productos(id) ON DELETE CASCADE,
  almacen_id TEXT NOT NULL REFERENCES erp_almacenes(id) ON DELETE CASCADE,
  tipo_movimiento TEXT NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'devolucion', 'transferencia')),
  cantidad NUMERIC NOT NULL,
  referencia_tipo TEXT,
  referencia_id TEXT,
  descripcion TEXT,
  usuario_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_facturas_compra (
  id TEXT PRIMARY KEY,
  empresa_id TEXT NOT NULL,
  orden_compra_id TEXT REFERENCES erp_ordenes_compra(id) ON DELETE SET NULL,
  proveedor_id TEXT NOT NULL,
  numero_factura TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL CHECK (estado IN ('recibida', 'validada', 'pagada', 'anulada')),
  fecha_recepcion DATE NOT NULL,
  fecha_vencimiento DATE,
  fecha_pago DATE,
  subtotal NUMERIC NOT NULL,
  impuesto NUMERIC,
  total NUMERIC NOT NULL,
  moneda TEXT DEFAULT 'COP',
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

