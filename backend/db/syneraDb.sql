-- Supabase (PostgreSQL) ready
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MODULE: CORE
-- ============================================================================

CREATE TABLE core_companies (
    id UUID PRIMARY KEY,                   -- Unique identifier
    name VARCHAR(255) NOT NULL,            -- Legal name
    tax_id VARCHAR(50) NOT NULL,           -- Tax identifier (CIF / NIF / RUT)
    domain VARCHAR(100),                   -- Custom subdomain
    is_active BOOLEAN DEFAULT TRUE,        -- Subscription status
    settings JSONB,                        -- Global settings (JSON)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE core_users (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,              -- FK: Company owner
    email VARCHAR(255) NOT NULL,           -- Login credential
    password_hash VARCHAR(255) NOT NULL,   -- Hashed password
    mfa_enabled BOOLEAN DEFAULT FALSE,     -- Two-factor authentication
    is_active BOOLEAN DEFAULT TRUE,        -- Access lock
    last_login_at TIMESTAMP,               -- Access audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE,
    CONSTRAINT uq_users_email_company UNIQUE (email, company_id)
);

CREATE TABLE core_roles (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,              -- FK: Company owning the role
    name VARCHAR(100) NOT NULL,            -- Role name (e.g., Admin)
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,       -- System default roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_roles_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

CREATE TABLE core_permissions (
    id UUID PRIMARY KEY,
    module VARCHAR(50) NOT NULL,           -- Module (CORE, HR, CRM...)
    slug VARCHAR(100) NOT NULL UNIQUE,     -- Technical identifier (e.g., crm.view)
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE core_user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES core_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE
);

CREATE TABLE core_role_permissions (
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,

    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES core_roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES core_permissions(id) ON DELETE CASCADE
);

-- ============================================================================
-- MODULE: CRM
-- ============================================================================

CREATE TABLE IF NOT EXISTS crm_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  tax_id TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  responsible_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('lead', 'customer')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,

  CONSTRAINT fk_crm_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  client_id UUID NOT NULL REFERENCES crm_clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  last_name TEXT,
  job_title TEXT,
  email TEXT,
  phone TEXT,
  is_decision_maker BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,

  CONSTRAINT fk_crm_contacts_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crm_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,

  CONSTRAINT fk_crm_pipelines_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crm_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  pipeline_id UUID NOT NULL REFERENCES crm_pipelines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  default_probability INTEGER DEFAULT 0 CHECK (default_probability >= 0 AND default_probability <= 100),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,

  CONSTRAINT fk_crm_stages_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  client_id UUID NOT NULL REFERENCES crm_clients(id) ON DELETE CASCADE,
  pipeline_id UUID NOT NULL REFERENCES crm_pipelines(id) ON DELETE RESTRICT,
  stage_id UUID NOT NULL REFERENCES crm_stages(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT,
  estimated_value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  responsible_id TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,

  CONSTRAINT fk_crm_opportunities_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  client_id UUID REFERENCES crm_clients(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES crm_opportunities(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note')),
  subject TEXT NOT NULL,
  description TEXT,
  activity_at TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,

  CONSTRAINT fk_crm_activities_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

-- ============================================================================
-- MODULE: ALM
-- ============================================================================

CREATE TABLE IF NOT EXISTS alm_projects (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  responsible_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'paused', 'completed')),
  budget NUMERIC,
  client_id TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS alm_tasks (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  project_id TEXT NOT NULL REFERENCES alm_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to TEXT,
  due_date DATE,
  estimated_time INTEGER,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS alm_time_entries (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  task_id TEXT NOT NULL REFERENCES alm_tasks(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  hours NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- ============================================================================
-- MODULE: HR
-- ============================================================================

CREATE TABLE hr_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    parent_department_id UUID NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_dept_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_parent_department FOREIGN KEY (parent_department_id) REFERENCES hr_departments(id)
);

CREATE TABLE hr_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    hire_date DATE NOT NULL,
    department_id UUID NOT NULL,
    user_id UUID UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_emp_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES hr_departments(id),
    CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES core_users(id)
);

CREATE TABLE hr_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    contract_type VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_contract_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_contract FOREIGN KEY (employee_id) REFERENCES hr_employees(id)
);

CREATE TABLE hr_absences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_absence_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_absence FOREIGN KEY (employee_id) REFERENCES hr_employees(id)
);

CREATE TABLE hr_payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    period CHAR(7) NOT NULL,
    gross_amount DECIMAL(10,2) NOT NULL,
    net_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_payroll_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_payroll FOREIGN KEY (employee_id) REFERENCES hr_employees(id),
    CONSTRAINT uq_employee_period
        UNIQUE (employee_id, period)
);

CREATE TABLE hr_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    review_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_evaluation_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_evaluation FOREIGN KEY (employee_id) REFERENCES hr_employees(id)
);

-- ============================================================================
-- MODULE: SUPPORT
-- ============================================================================

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,
    creator_id UUID NOT NULL,
    assigned_to UUID NULL,

    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,

    category VARCHAR(30) NOT NULL
        CHECK (category IN ('technical','billing','other')),

    priority VARCHAR(20) NOT NULL
        CHECK (priority IN ('low','medium','high','urgent')),

    status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open','in_progress','resolved','closed')),

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    closed_at TIMESTAMPTZ NULL,

    sla_response_deadline TIMESTAMPTZ NULL,
    sla_resolution_deadline TIMESTAMPTZ NULL
);

CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL,
    user_id UUID NOT NULL,

    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT fk_message_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES support_tickets(id)
        ON DELETE CASCADE
);

CREATE TABLE support_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL,

    file_name VARCHAR(255),
    file_path VARCHAR(500),
    mime_type VARCHAR(100),
    file_size BIGINT,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT fk_attachment_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES support_tickets(id)
        ON DELETE CASCADE
);

CREATE TABLE support_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ticket_id UUID NOT NULL,
    user_id UUID NOT NULL,

    action VARCHAR(50) NOT NULL,
    old_value VARCHAR(500),
    new_value VARCHAR(500),

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT fk_audit_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES support_tickets(id)
        ON DELETE CASCADE
);

CREATE TABLE support_sla_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    category VARCHAR(30),
    priority VARCHAR(20),

    max_response_minutes INT NOT NULL,
    max_resolution_minutes INT NOT NULL
);

-- ============================================================================
-- MODULE: BI
-- ============================================================================

CREATE TABLE bi_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    module VARCHAR(50),

    query_definition TEXT NOT NULL,

    owner_id UUID NOT NULL,
    company_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bi_report_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id UUID NOT NULL,

    status VARCHAR(30),
    output_path VARCHAR(500),

    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,

    CONSTRAINT fk_report_run
        FOREIGN KEY (report_id)
        REFERENCES bi_reports(id)
        ON DELETE CASCADE
);

CREATE TABLE bi_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(200),
    source VARCHAR(100),

    query_sql TEXT,

    last_refresh TIMESTAMPTZ
);

CREATE TABLE bi_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,

    metric_key VARCHAR(100),
    condition VARCHAR(10),
    threshold FLOAT,

    last_triggered TIMESTAMPTZ NULL,

    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- MODULE: BPM
-- ============================================================================

CREATE TABLE IF NOT EXISTS bpm_processes (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  version INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'archived')),
  flow_json JSONB,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_activities (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  process_id TEXT NOT NULL REFERENCES bpm_processes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('task', 'decision_gateway', 'event', 'wait')),
  sort_order INT NOT NULL,
  assigned_role TEXT,
  time_limit_hours INT,
  required_docs JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_approvals (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  process_id TEXT NOT NULL REFERENCES bpm_processes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT,
  level INT NOT NULL,
  required_approvers INT NOT NULL,
  sla_hours INT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_approval_requests (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  approval_id TEXT NOT NULL REFERENCES bpm_approvals(id) ON DELETE CASCADE,
  reference_id TEXT,
  reference_type TEXT,
  requester_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_approval_responses (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  request_id TEXT NOT NULL REFERENCES bpm_approval_requests(id) ON DELETE CASCADE,
  approver_id TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'pending')),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_process_instances (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  process_id TEXT NOT NULL REFERENCES bpm_processes(id) ON DELETE CASCADE,
  reference_id TEXT,
  reference_type TEXT,
  alm_project_id TEXT,
  alm_task_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('started', 'in_progress', 'completed', 'canceled', 'error')),
  progress_percent INT DEFAULT 0,
  started_by TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_process_tasks (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  instance_id TEXT NOT NULL REFERENCES bpm_process_instances(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL REFERENCES bpm_activities(id) ON DELETE CASCADE,
  alm_task_id TEXT,
  assigned_to TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result_json JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_documents (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  instance_id TEXT NOT NULL REFERENCES bpm_process_instances(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  document_type TEXT,
  size BIGINT,
  storage_url TEXT,
  user_id TEXT NOT NULL,
  classification TEXT,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_comments (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  instance_id TEXT NOT NULL REFERENCES bpm_process_instances(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS bpm_audit_log (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  process_id TEXT NOT NULL REFERENCES bpm_processes(id) ON DELETE CASCADE,
  instance_id TEXT,
  user_id TEXT,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL
);

-- ============================================================================
-- MODULE: ERP
-- ============================================================================

CREATE TABLE IF NOT EXISTS erp_products (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  product_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category_id TEXT,
  cost_price NUMERIC NOT NULL,
  sale_price NUMERIC NOT NULL,
  profit_margin NUMERIC,
  unit_of_measure TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_product_categories (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_inventory (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id TEXT NOT NULL REFERENCES erp_products(id) ON DELETE CASCADE,
  warehouse_id TEXT NOT NULL,
  quantity_available NUMERIC NOT NULL DEFAULT 0,
  quantity_reserved NUMERIC NOT NULL DEFAULT 0,
  minimum_quantity NUMERIC NOT NULL,
  maximum_quantity NUMERIC NOT NULL,
  last_movement_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_warehouses (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  total_capacity NUMERIC,
  responsible_id TEXT,
  type TEXT CHECK (type IN ('main', 'secondary', 'transit')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(50),
  contact_email VARCHAR(150),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT fk_provider_company FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS erp_purchase_orders (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES erp_suppliers(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'confirmed', 'partially_received', 'received', 'canceled')),
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'COP',
  comments TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_purchase_items (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  purchase_order_id TEXT NOT NULL REFERENCES erp_purchase_orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES erp_products(id) ON DELETE CASCADE,
  quantity_ordered NUMERIC NOT NULL,
  quantity_received NUMERIC DEFAULT 0,
  unit_price NUMERIC NOT NULL,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_sales_orders (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  client_id TEXT NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('quote', 'confirmed', 'packed', 'shipped', 'delivered', 'canceled')),
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'COP',
  payment_terms TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_sales_items (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  sales_order_id TEXT NOT NULL REFERENCES erp_sales_orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES erp_products(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  discount_percentage NUMERIC DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_invoices (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  sales_order_id TEXT REFERENCES erp_sales_orders(id) ON DELETE SET NULL,
  client_id TEXT NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'issued', 'voided', 'paid')),
  issue_date DATE NOT NULL,
  due_date DATE,
  paid_date DATE,
  subtotal NUMERIC NOT NULL,
  tax_percent NUMERIC,
  tax_amount NUMERIC,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'COP',
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_inventory_movements (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id TEXT NOT NULL REFERENCES erp_products(id) ON DELETE CASCADE,
  warehouse_id TEXT NOT NULL REFERENCES erp_warehouses(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'return', 'transfer')),
  quantity NUMERIC NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  description TEXT,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS erp_purchase_invoices (
  id TEXT PRIMARY KEY,
  company_id UUID NOT NULL,
  purchase_order_id TEXT REFERENCES erp_purchase_orders(id) ON DELETE SET NULL,
  supplier_id TEXT NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('received', 'validated', 'paid', 'voided')),
  received_date DATE NOT NULL,
  due_date DATE,
  paid_date DATE,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'COP',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
