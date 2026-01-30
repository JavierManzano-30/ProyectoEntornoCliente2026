-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.alm_proyectos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  fecha_inicio date NOT NULL,
  fecha_fin date,
  responsable_employee_id uuid NOT NULL,
  cliente_id uuid,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['planificacion'::text, 'en_curso'::text, 'pausado'::text, 'completado'::text])),
  presupuesto numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT alm_proyectos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_alm_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.alm_registro_horas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  tarea_id uuid NOT NULL,
  usuario_id uuid NOT NULL,
  fecha date NOT NULL,
  horas numeric NOT NULL,
  descripcion text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT alm_registro_horas_pkey PRIMARY KEY (id),
  CONSTRAINT fk_registro_tarea FOREIGN KEY (tarea_id) REFERENCES public.alm_tareas(id)
);
CREATE TABLE public.alm_tareas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  proyecto_id uuid NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['pendiente'::text, 'en_progreso'::text, 'completada'::text])),
  prioridad text NOT NULL CHECK (prioridad = ANY (ARRAY['baja'::text, 'media'::text, 'alta'::text])),
  employee_id uuid,
  fecha_vencimiento date,
  tiempo_estimado integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT alm_tareas_pkey PRIMARY KEY (id),
  CONSTRAINT fk_tarea_proyecto FOREIGN KEY (proyecto_id) REFERENCES public.alm_proyectos(id)
);
CREATE TABLE public.ausencias (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  type character varying CHECK (type::text = ANY (ARRAY['vacaciones'::character varying, 'baja_medica'::character varying, 'permiso'::character varying]::text[])),
  start_date date NOT NULL,
  end_date date NOT NULL,
  status character varying DEFAULT 'pendiente'::character varying CHECK (status::text = ANY (ARRAY['pendiente'::character varying, 'aprobada'::character varying, 'rechazada'::character varying]::text[])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ausencias_pkey PRIMARY KEY (id),
  CONSTRAINT fk_ausencia_empleado FOREIGN KEY (employee_id) REFERENCES public.empleados(id)
);
CREATE TABLE public.bi_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  metric_key text,
  condition text,
  threshold double precision,
  last_triggered timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bi_alerts_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bi_alert_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.bi_datasets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  source text,
  query_sql text,
  last_refresh timestamp with time zone,
  CONSTRAINT bi_datasets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.bi_report_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL,
  status text,
  output_path text,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  CONSTRAINT bi_report_runs_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bi_report_run FOREIGN KEY (report_id) REFERENCES public.bi_reports(id)
);
CREATE TABLE public.bi_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  module text,
  query_definition text NOT NULL,
  owner_id uuid NOT NULL,
  empresa_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bi_reports_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bi_report_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.bpm_actividades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  proceso_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['tarea'::text, 'puerta_decision'::text, 'evento'::text, 'espera'::text])),
  orden integer NOT NULL,
  asignado_a_role text,
  tiempo_limite_horas integer,
  required_docs jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_actividades_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_actividad_proceso FOREIGN KEY (proceso_id) REFERENCES public.bpm_procesos(id)
);
CREATE TABLE public.bpm_aprobaciones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  proceso_id uuid NOT NULL,
  nombre text NOT NULL,
  tipo_documento text,
  nivel integer NOT NULL,
  aprobadores_requeridos integer NOT NULL,
  sla_horas integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_aprobaciones_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_aprobacion_proceso FOREIGN KEY (proceso_id) REFERENCES public.bpm_procesos(id)
);
CREATE TABLE public.bpm_auditoria (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  proceso_id uuid NOT NULL,
  instancia_id uuid,
  usuario_id uuid,
  accion text NOT NULL,
  detalles jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_auditoria_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_auditoria_proceso FOREIGN KEY (proceso_id) REFERENCES public.bpm_procesos(id)
);
CREATE TABLE public.bpm_comentarios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  instancia_id uuid NOT NULL,
  usuario_id uuid NOT NULL,
  contenido text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_comentarios_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_comentario_instancia FOREIGN KEY (instancia_id) REFERENCES public.bpm_instancias_proceso(id)
);
CREATE TABLE public.bpm_documentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  instancia_id uuid NOT NULL,
  nombre_archivo text NOT NULL,
  tipo_documento text,
  tamano bigint,
  url_almacenamiento text,
  usuario_id uuid NOT NULL,
  clasificacion text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_documentos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_documento_instancia FOREIGN KEY (instancia_id) REFERENCES public.bpm_instancias_proceso(id)
);
CREATE TABLE public.bpm_instancias_proceso (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  proceso_id uuid NOT NULL,
  referencia_id uuid,
  referencia_tipo text,
  proyecto_alm_id uuid,
  tarea_alm_id uuid,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['iniciado'::text, 'en_curso'::text, 'completado'::text, 'cancelado'::text, 'error'::text])),
  progreso_porcentaje integer DEFAULT 0,
  iniciado_por uuid NOT NULL,
  fecha_inicio timestamp with time zone NOT NULL,
  fecha_fin timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_instancias_proceso_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_instancia_proceso FOREIGN KEY (proceso_id) REFERENCES public.bpm_procesos(id)
);
CREATE TABLE public.bpm_procesos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  version integer NOT NULL DEFAULT 1,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['activo'::text, 'inactivo'::text, 'archivado'::text])),
  flujo_json jsonb,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_procesos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.bpm_respuestas_aprobacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  solicitud_id uuid NOT NULL,
  aprobador_id uuid NOT NULL,
  decision text NOT NULL CHECK (decision = ANY (ARRAY['aprobado'::text, 'rechazado'::text, 'pendiente'::text])),
  comentarios text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_respuestas_aprobacion_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_respuesta_solicitud FOREIGN KEY (solicitud_id) REFERENCES public.bpm_solicitudes_aprobacion(id)
);
CREATE TABLE public.bpm_solicitudes_aprobacion (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  aprobacion_id uuid NOT NULL,
  referencia_id uuid,
  referencia_tipo text,
  solicitante_id uuid NOT NULL,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['pendiente'::text, 'aprobado'::text, 'rechazado'::text, 'en_revision'::text])),
  prioridad text NOT NULL CHECK (prioridad = ANY (ARRAY['baja'::text, 'media'::text, 'alta'::text])),
  fecha_vencimiento timestamp with time zone,
  fecha_inicio timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_solicitudes_aprobacion_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_solicitud_aprobacion FOREIGN KEY (aprobacion_id) REFERENCES public.bpm_aprobaciones(id)
);
CREATE TABLE public.bpm_tareas_proceso (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  instancia_id uuid NOT NULL,
  actividad_id uuid NOT NULL,
  tarea_alm_id uuid,
  asignado_a uuid,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['pendiente'::text, 'en_progreso'::text, 'completada'::text, 'rechazada'::text])),
  fecha_vencimiento timestamp with time zone,
  fecha_inicio timestamp with time zone,
  fecha_completacion timestamp with time zone,
  resultado_json jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bpm_tareas_proceso_pkey PRIMARY KEY (id),
  CONSTRAINT fk_bpm_tarea_instancia FOREIGN KEY (instancia_id) REFERENCES public.bpm_instancias_proceso(id),
  CONSTRAINT fk_bpm_tarea_actividad FOREIGN KEY (actividad_id) REFERENCES public.bpm_actividades(id)
);
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  tax_id character varying NOT NULL,
  domain character varying,
  is_active boolean DEFAULT true,
  settings jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contratos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date,
  contract_type character varying NOT NULL,
  salary numeric NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contratos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_contrato_empleado FOREIGN KEY (employee_id) REFERENCES public.empleados(id)
);
CREATE TABLE public.crm_actividades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  usuario_id uuid NOT NULL,
  cliente_id uuid,
  oportunidad_id uuid,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['llamada'::text, 'email'::text, 'reunion'::text, 'nota'::text])),
  asunto text NOT NULL,
  descripcion text,
  fecha timestamp with time zone NOT NULL,
  fecha_vencimiento timestamp with time zone,
  completada boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crm_actividades_pkey PRIMARY KEY (id),
  CONSTRAINT fk_actividad_cliente FOREIGN KEY (cliente_id) REFERENCES public.crm_clientes(id),
  CONSTRAINT fk_actividad_oportunidad FOREIGN KEY (oportunidad_id) REFERENCES public.crm_oportunidades(id)
);
CREATE TABLE public.crm_clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  cif text,
  email text,
  telefono text,
  direccion text,
  ciudad text,
  responsable_user_id uuid,
  tipo text NOT NULL CHECK (tipo = ANY (ARRAY['lead'::text, 'cliente'::text])),
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crm_clientes_pkey PRIMARY KEY (id),
  CONSTRAINT fk_crm_client_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.crm_contactos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  nombre text NOT NULL,
  apellidos text,
  cargo text,
  email text,
  telefono text,
  es_decisor boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crm_contactos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_contacto_cliente FOREIGN KEY (cliente_id) REFERENCES public.crm_clientes(id)
);
CREATE TABLE public.crm_fases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  pipeline_id uuid NOT NULL,
  nombre text NOT NULL,
  orden integer NOT NULL,
  probabilidad_defecto integer DEFAULT 0 CHECK (probabilidad_defecto >= 0 AND probabilidad_defecto <= 100),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crm_fases_pkey PRIMARY KEY (id),
  CONSTRAINT fk_fase_pipeline FOREIGN KEY (pipeline_id) REFERENCES public.crm_pipelines(id)
);
CREATE TABLE public.crm_oportunidades (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  pipeline_id uuid NOT NULL,
  fase_id uuid NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  valor_estimado numeric DEFAULT 0,
  moneda text DEFAULT 'EUR'::text,
  probabilidad integer DEFAULT 0 CHECK (probabilidad >= 0 AND probabilidad <= 100),
  fecha_cierre_prevista date,
  responsable_user_id uuid,
  orden integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crm_oportunidades_pkey PRIMARY KEY (id),
  CONSTRAINT fk_oportunidad_cliente FOREIGN KEY (cliente_id) REFERENCES public.crm_clientes(id),
  CONSTRAINT fk_oportunidad_pipeline FOREIGN KEY (pipeline_id) REFERENCES public.crm_pipelines(id),
  CONSTRAINT fk_oportunidad_fase FOREIGN KEY (fase_id) REFERENCES public.crm_fases(id)
);
CREATE TABLE public.crm_pipelines (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT crm_pipelines_pkey PRIMARY KEY (id),
  CONSTRAINT fk_pipeline_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.departamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  name character varying NOT NULL,
  parent_department_id uuid,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT departamentos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_dept_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id),
  CONSTRAINT fk_departamento_padre FOREIGN KEY (parent_department_id) REFERENCES public.departamentos(id)
);
CREATE TABLE public.empleados (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  user_id uuid NOT NULL,
  department_id uuid NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL,
  status character varying DEFAULT 'activo'::character varying CHECK (status::text = ANY (ARRAY['activo'::character varying, 'inactivo'::character varying, 'baja'::character varying]::text[])),
  hire_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT empleados_pkey PRIMARY KEY (id),
  CONSTRAINT fk_emp_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id),
  CONSTRAINT fk_empleado_user FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT fk_empleado_departamento FOREIGN KEY (department_id) REFERENCES public.departamentos(id)
);
CREATE TABLE public.erp_almacenes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  ubicacion text,
  capacidad_total numeric,
  responsable_user_id uuid,
  tipo text CHECK (tipo = ANY (ARRAY['principal'::text, 'secundario'::text, 'transitorio'::text])),
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_almacenes_pkey PRIMARY KEY (id),
  CONSTRAINT fk_erp_alm_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.erp_categorias_producto (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_categorias_producto_pkey PRIMARY KEY (id),
  CONSTRAINT fk_erp_cat_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.erp_facturas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  orden_venta_id uuid,
  cliente_id uuid NOT NULL,
  numero_factura text NOT NULL UNIQUE,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['borrador'::text, 'emitida'::text, 'anulada'::text, 'pagada'::text])),
  fecha_emision date NOT NULL,
  fecha_vencimiento date,
  fecha_pago date,
  subtotal numeric NOT NULL,
  impuesto_porcentaje numeric,
  impuesto_monto numeric,
  total numeric NOT NULL,
  moneda text DEFAULT 'COP'::text,
  notas text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_facturas_pkey PRIMARY KEY (id),
  CONSTRAINT fk_factura_orden_venta FOREIGN KEY (orden_venta_id) REFERENCES public.erp_ordenes_venta(id),
  CONSTRAINT fk_erp_fac_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.erp_facturas_compra (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  orden_compra_id uuid,
  proveedor_id uuid NOT NULL,
  numero_factura text NOT NULL,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['recibida'::text, 'validada'::text, 'pagada'::text, 'anulada'::text])),
  fecha_recepcion date NOT NULL,
  fecha_vencimiento date,
  fecha_pago date,
  subtotal numeric NOT NULL,
  impuesto numeric,
  total numeric NOT NULL,
  moneda text DEFAULT 'COP'::text,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_facturas_compra_pkey PRIMARY KEY (id),
  CONSTRAINT fk_fc_orden_compra FOREIGN KEY (orden_compra_id) REFERENCES public.erp_ordenes_compra(id),
  CONSTRAINT fk_fc_proveedor FOREIGN KEY (proveedor_id) REFERENCES public.erp_proveedores(id),
  CONSTRAINT fk_fc_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.erp_inventario (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  almacen_id uuid NOT NULL,
  cantidad_disponible numeric DEFAULT 0,
  cantidad_reservada numeric DEFAULT 0,
  cantidad_minima numeric NOT NULL,
  cantidad_maxima numeric NOT NULL,
  fecha_ultimo_movimiento timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_inventario_pkey PRIMARY KEY (id),
  CONSTRAINT fk_inventario_producto FOREIGN KEY (producto_id) REFERENCES public.erp_productos(id),
  CONSTRAINT fk_inventario_almacen FOREIGN KEY (almacen_id) REFERENCES public.erp_almacenes(id)
);
CREATE TABLE public.erp_items_compra (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  orden_compra_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  cantidad_pedida numeric NOT NULL,
  cantidad_recibida numeric DEFAULT 0,
  precio_unitario numeric NOT NULL,
  subtotal numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_items_compra_pkey PRIMARY KEY (id),
  CONSTRAINT fk_item_compra_orden FOREIGN KEY (orden_compra_id) REFERENCES public.erp_ordenes_compra(id),
  CONSTRAINT fk_item_compra_producto FOREIGN KEY (producto_id) REFERENCES public.erp_productos(id)
);
CREATE TABLE public.erp_items_venta (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  orden_venta_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  cantidad numeric NOT NULL,
  precio_unitario numeric NOT NULL,
  descuento_porcentaje numeric DEFAULT 0,
  subtotal numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_items_venta_pkey PRIMARY KEY (id),
  CONSTRAINT fk_item_venta_orden FOREIGN KEY (orden_venta_id) REFERENCES public.erp_ordenes_venta(id),
  CONSTRAINT fk_item_venta_producto FOREIGN KEY (producto_id) REFERENCES public.erp_productos(id)
);
CREATE TABLE public.erp_movimientos_inventario (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  producto_id uuid NOT NULL,
  almacen_id uuid NOT NULL,
  tipo_movimiento text NOT NULL CHECK (tipo_movimiento = ANY (ARRAY['entrada'::text, 'salida'::text, 'ajuste'::text, 'devolucion'::text, 'transferencia'::text])),
  cantidad numeric NOT NULL,
  referencia_tipo text,
  referencia_id uuid,
  descripcion text,
  usuario_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_movimientos_inventario_pkey PRIMARY KEY (id),
  CONSTRAINT fk_movimiento_producto FOREIGN KEY (producto_id) REFERENCES public.erp_productos(id),
  CONSTRAINT fk_movimiento_almacen FOREIGN KEY (almacen_id) REFERENCES public.erp_almacenes(id)
);
CREATE TABLE public.erp_ordenes_compra (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  proveedor_id uuid NOT NULL,
  numero_orden text NOT NULL UNIQUE,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['borrador'::text, 'confirmada'::text, 'recibida_parcial'::text, 'recibida'::text, 'cancelada'::text])),
  fecha_pedido date NOT NULL,
  fecha_entrega_esperada date,
  fecha_entrega_real date,
  total numeric NOT NULL,
  moneda text DEFAULT 'COP'::text,
  comentarios text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_ordenes_compra_pkey PRIMARY KEY (id),
  CONSTRAINT fk_erp_oc_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id),
  CONSTRAINT fk_orden_proveedor FOREIGN KEY (proveedor_id) REFERENCES public.erp_proveedores(id)
);
CREATE TABLE public.erp_ordenes_venta (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  numero_orden text NOT NULL UNIQUE,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['cotizacion'::text, 'confirmada'::text, 'empaquetada'::text, 'enviada'::text, 'entregada'::text, 'cancelada'::text])),
  fecha_pedido date NOT NULL,
  fecha_entrega_esperada date,
  fecha_entrega_real date,
  subtotal numeric NOT NULL,
  impuesto numeric NOT NULL,
  total numeric NOT NULL,
  moneda text DEFAULT 'COP'::text,
  condicion_pago text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_ordenes_venta_pkey PRIMARY KEY (id),
  CONSTRAINT fk_erp_ov_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.erp_productos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  codigo_producto text NOT NULL UNIQUE,
  nombre text NOT NULL,
  descripcion text,
  categoria_id uuid,
  precio_costo numeric NOT NULL,
  precio_venta numeric NOT NULL,
  margen_ganancia numeric,
  unidad_medida text,
  estado text NOT NULL CHECK (estado = ANY (ARRAY['activo'::text, 'inactivo'::text, 'discontinuado'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_productos_pkey PRIMARY KEY (id),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES public.erp_categorias_producto(id),
  CONSTRAINT fk_erp_prod_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.erp_proveedores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre_fiscal character varying NOT NULL,
  cif character varying,
  email_contacto character varying,
  telefono character varying,
  direccion text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT erp_proveedores_pkey PRIMARY KEY (id),
  CONSTRAINT fk_provider_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.evaluaciones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  score integer CHECK (score >= 0 AND score <= 100),
  review_date date NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT evaluaciones_pkey PRIMARY KEY (id),
  CONSTRAINT fk_evaluacion_empleado FOREIGN KEY (employee_id) REFERENCES public.empleados(id)
);
CREATE TABLE public.nominas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  period character varying NOT NULL,
  gross_amount numeric NOT NULL,
  net_amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT nominas_pkey PRIMARY KEY (id),
  CONSTRAINT fk_nomina_empleado FOREIGN KEY (employee_id) REFERENCES public.empleados(id)
);
CREATE TABLE public.permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT permissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.role_permissions (
  role_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES public.roles(id),
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES public.permissions(id)
);
CREATE TABLE public.roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  is_system boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_roles_company FOREIGN KEY (company_id) REFERENCES public.companies(id)
);
CREATE TABLE public.support_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL,
  file_name text,
  file_path text,
  mime_type text,
  file_size bigint,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_attachments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_support_attachment_ticket FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id)
);
CREATE TABLE public.support_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL,
  user_id uuid NOT NULL,
  action text NOT NULL,
  old_value text,
  new_value text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT fk_support_audit_ticket FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id)
);
CREATE TABLE public.support_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL,
  usuario_id uuid NOT NULL,
  contenido text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_messages_pkey PRIMARY KEY (id),
  CONSTRAINT fk_support_message_ticket FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id)
);
CREATE TABLE public.support_sla_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  categoria text,
  prioridad text,
  max_response_minutes integer NOT NULL,
  max_resolution_minutes integer NOT NULL,
  CONSTRAINT support_sla_rules_pkey PRIMARY KEY (id)
);
CREATE TABLE public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  creador_user_id uuid NOT NULL,
  asignado_employee_id uuid,
  titulo text NOT NULL,
  descripcion text NOT NULL,
  categoria text NOT NULL CHECK (categoria = ANY (ARRAY['tecnico'::text, 'facturacion'::text, 'otro'::text])),
  prioridad text NOT NULL CHECK (prioridad = ANY (ARRAY['baja'::text, 'media'::text, 'alta'::text, 'urgente'::text])),
  estado text DEFAULT 'abierto'::text CHECK (estado = ANY (ARRAY['abierto'::text, 'en_progreso'::text, 'resuelto'::text, 'cerrado'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  closed_at timestamp with time zone,
  sla_response_deadline timestamp with time zone,
  sla_resolution_deadline timestamp with time zone,
  CONSTRAINT support_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT fk_support_company FOREIGN KEY (empresa_id) REFERENCES public.companies(id)
);
CREATE TABLE public.user_roles (
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES public.roles(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  email character varying NOT NULL,
  password_hash character varying NOT NULL,
  mfa_enabled boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES public.companies(id)
);