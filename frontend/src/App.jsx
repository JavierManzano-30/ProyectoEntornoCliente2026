import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Páginas del módulo de soporte
import SupportDashboard from './modules/soporte/pages/SupportDashboard';
import TicketList from './modules/soporte/pages/TicketList';
import TicketDetail from './modules/soporte/pages/TicketDetail';

// Páginas del módulo RRHH
import EmployeeList from './modules/rrhh/pages/EmployeeList';
import EmployeeDetail from './modules/rrhh/pages/EmployeeDetail';
import AbsenceManagement from './modules/rrhh/pages/AbsenceManagement';
import PayrollList from './modules/rrhh/pages/PayrollList';
import DepartmentManagement from './modules/rrhh/pages/DepartmentManagement';

// Páginas del módulo CORE
import {
  Login,
  Dashboard,
  UserList,
  UserDetail,
  UserForm,
  CompanyList,
  CompanyDetail,
  CompanyForm,
  RoleManagement
} from './modules/core';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/core" replace />} />
        
        {/* Ruta de Login (pública) */}
        <Route path="/login" element={<Login />} />

        {/* Rutas del módulo de soporte */}
        <Route path="/soporte" element={<MainLayout module="soporte" />}>
          <Route index element={<SupportDashboard />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="sla" element={<div style={{padding: '2rem'}}>Página SLA (Próximamente)</div>} />
          <Route path="reportes" element={<div style={{padding: '2rem'}}>Página Reportes (Próximamente)</div>} />
          <Route path="config" element={<div style={{padding: '2rem'}}>Configuración (Próximamente)</div>} />
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

        {/* Ruta 404 */}
        <Route path="*" element={<div style={{padding: '2rem', textAlign: 'center'}}>Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
