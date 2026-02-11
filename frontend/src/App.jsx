import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Páginas del módulo de soporte
import SupportDashboard from "./modules/soporte/pages/SupportDashboard";
import TicketList from "./modules/soporte/pages/TicketList";
import TicketDetail from "./modules/soporte/pages/TicketDetail";
import SLAManagement from "./modules/soporte/pages/SLAManagement";
import Reports from "./modules/soporte/pages/Reports";
import Configuration from "./modules/soporte/pages/Configuration";
import { SoporteProvider } from "./modules/soporte/context/SoporteContext";

// Páginas del módulo RRHH
import EmployeeList from "./modules/rrhh/pages/EmployeeList";
import EmployeeDetail from "./modules/rrhh/pages/EmployeeDetail";
import AbsenceManagement from "./modules/rrhh/pages/AbsenceManagement";
import PayrollList from "./modules/rrhh/pages/PayrollList";
import DepartmentManagement from "./modules/rrhh/pages/DepartmentManagement";

// Páginas del módulo CORE
import {
  Dashboard,
  UserList,
  UserDetail,
  UserForm,
  CompanyList,
  CompanyDetail,
  CompanyForm,
  RoleManagement,
} from "./modules/core";

// Lazy imports para Login y Landing
const Login = React.lazy(() => import("./modules/login"));
const Landing = React.lazy(() => import("./modules/landing"));

// Páginas del módulo CRM
import CRMDashboard from "./modules/crm/pages/CRMDashboard";
import CustomerList from "./modules/crm/pages/CustomerList";
import LeadList from "./modules/crm/pages/LeadList";
import OpportunityBoard from "./modules/crm/pages/OpportunityBoard";

// Páginas del módulo ALM
import {
  ProjectList,
  ProjectForm,
  ProjectDetail,
  TaskManagement,
  TimeTracking,
} from "./modules/alm";

// Páginas del módulo BI
import {
  DashboardPage,
  ReportsPage,
  DatasetsPage,
  AlertsPage,
  BIProvider,
} from "./modules/bi";

// Páginas del módulo BPM
import {
  BPMDashboard,
  ProcessList,
  ProcessDesigner,
  ProcessStartForm,
  TaskInbox,
  InstanceMonitor,
  BPMProvider,
} from "./modules/bpm";

// Páginas del módulo ERP
import {
  ERPDashboard,
  AccountingGeneral,
  PurchaseManagement,
  SalesInvoicing,
  InventoryControl,
  ProductionPlanning,
  ProjectCosting,
  TreasuryManagement,
  FinancialReporting,
  ERPProvider,
} from "./modules/erp";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ERPProvider>
        <BPMProvider>
          <BIProvider>
            <SoporteProvider>
              <React.Suspense fallback={<div>Cargando...</div>}>
                <Routes>
                  {/* Landing page como home */}
                  <Route path="/" element={<Landing />} />
                  {/* Ruta de Login (pública) */}
                  <Route path="/login" element={<Login />} />

                  {/* Rutas del módulo de soporte */}
                  <Route path="/soporte" element={<MainLayout module="soporte" />}>
                <Route index element={<SupportDashboard />} />
                <Route path="tickets" element={<TicketList />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
                <Route path="sla" element={<SLAManagement />} />
                <Route path="reportes" element={<Reports />} />
                <Route path="config" element={<Configuration />} />
              </Route>

            {/* Rutas del módulo RRHH */}
            <Route path="/rrhh" element={<MainLayout module="rrhh" />}>
              <Route index element={<EmployeeList />} />
              <Route path="empleados" element={<EmployeeList />} />
              <Route path="empleados/:id" element={<EmployeeDetail />} />
              <Route path="ausencias" element={<AbsenceManagement />} />
              <Route path="nominas" element={<PayrollList />} />
              <Route path="departamentos" element={<DepartmentManagement />} />
            </Route>

            {/* Rutas del módulo CORE */}
            <Route path="/core" element={<MainLayout module="core" />}>
              <Route index element={<Dashboard />} />
              <Route path="usuarios" element={<UserList />} />
              <Route path="usuarios/nuevo" element={<UserForm />} />
              <Route path="usuarios/:id" element={<UserDetail />} />
              <Route path="usuarios/:id/editar" element={<UserForm />} />
              <Route path="empresas" element={<CompanyList />} />
              <Route path="empresas/nuevo" element={<CompanyForm />} />
              <Route path="empresas/:id" element={<CompanyDetail />} />
              <Route path="empresas/:id/editar" element={<CompanyForm />} />
              <Route path="roles" element={<RoleManagement />} />
            </Route>

            {/* Rutas del módulo CRM */}
            <Route path="/crm" element={<MainLayout module="crm" />}>
              <Route index element={<CRMDashboard />} />
              <Route path="dashboard" element={<CRMDashboard />} />
              <Route path="clientes" element={<CustomerList />} />
              <Route path="leads" element={<LeadList />} />
              <Route path="oportunidades" element={<OpportunityBoard />} />
            </Route>

            {/* Rutas del módulo BI */}
            <Route path="/bi" element={<MainLayout module="bi" />}>
              <Route index element={<DashboardPage />} />
              <Route path="informes" element={<ReportsPage />} />
              <Route path="datasets" element={<DatasetsPage />} />
              <Route path="alertas" element={<AlertsPage />} />
            </Route>

            {/* Rutas del módulo ALM */}
            <Route path="/alm" element={<MainLayout module="alm" />}>
              <Route index element={<ProjectList />} />
              <Route path="proyectos" element={<ProjectList />} />
              <Route path="proyectos/nuevo" element={<ProjectForm />} />
              <Route path="proyectos/:id" element={<ProjectDetail />} />
              <Route path="proyectos/:id/editar" element={<ProjectForm />} />
              <Route path="tareas" element={<TaskManagement />} />
              <Route path="tiempos" element={<TimeTracking />} />
            </Route>

            {/* Rutas del módulo BPM */}
            <Route path="/bpm" element={<MainLayout module="bpm" />}>
              <Route index element={<BPMDashboard />} />
              <Route path="dashboard" element={<BPMDashboard />} />
              <Route path="procesos" element={<ProcessList />} />
              <Route path="procesos/nuevo" element={<ProcessStartForm />} />
              <Route path="procesos/:id/diseñar" element={<ProcessDesigner />} />
              <Route path="procesos/:id/iniciar" element={<ProcessStartForm />} />
              <Route path="tareas" element={<TaskInbox />} />
              <Route path="instancias/:id" element={<InstanceMonitor />} />
            </Route>

            {/* Rutas del módulo ERP */}
            <Route path="/erp" element={<MainLayout module="erp" />}>
              <Route index element={<ERPDashboard />} />
              <Route path="dashboard" element={<ERPDashboard />} />
              <Route path="contabilidad" element={<AccountingGeneral />} />
              <Route path="compras" element={<PurchaseManagement />} />
              <Route path="ventas" element={<SalesInvoicing />} />
              <Route path="inventario" element={<InventoryControl />} />
              <Route path="produccion" element={<ProductionPlanning />} />
              <Route path="proyectos" element={<ProjectCosting />} />
              <Route path="tesoreria" element={<TreasuryManagement />} />
              <Route path="reportes" element={<FinancialReporting />} />
            </Route>

                  {/* Ruta 404 */}
                  <Route
                    path="*"
                    element={
                      <div style={{ padding: "2rem", textAlign: "center" }}>
                        Página no encontrada
                      </div>
                    }
                  />
                </Routes>
              </React.Suspense>
            </SoporteProvider>
          </BIProvider>
        </BPMProvider>
      </ERPProvider>
    </BrowserRouter>
  );
}

export default App;
