import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Páginas del módulo de soporte
import SupportDashboard from "./modules/soporte/pages/SupportDashboard";
import TicketList from "./modules/soporte/pages/TicketList";
import TicketDetail from "./modules/soporte/pages/TicketDetail";

// Páginas del módulo de BI
import DashboardView from "./modules/bi/pages/DashboardView";
import ModuleDashboard from "./modules/bi/pages/ModuleDashboard";
import ReportList from "./modules/bi/pages/ReportList";
import ReportViewer from "./modules/bi/pages/ReportViewer";
import DatasetManager from "./modules/bi/pages/DatasetManager";
import AlertManager from "./modules/bi/pages/AlertManager";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/soporte" replace />} />

        {/* Rutas del módulo de soporte */}
        <Route path="/soporte" element={<MainLayout />}>
          <Route index element={<SupportDashboard />} />
          <Route path="tickets" element={<TicketList />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route
            path="sla"
            element={
              <div style={{ padding: "2rem" }}>Página SLA (Próximamente)</div>
            }
          />
          <Route
            path="reportes"
            element={
              <div style={{ padding: "2rem" }}>
                Página Reportes (Próximamente)
              </div>
            }
          />
          <Route
            path="config"
            element={
              <div style={{ padding: "2rem" }}>
                Configuración (Próximamente)
              </div>
            }
          />
        </Route>

        {/* Rutas del módulo de BI */}
        {/* Todas las rutas BI usan el layout de BI */}
        {/* El layout ya se aplica en cada página, así que no es necesario un Route anidado */}
        <Route path="/bi/dashboard" element={<DashboardView />} />
        <Route path="/bi/modulo/:modulo" element={<ModuleDashboard />} />
        <Route path="/bi/informes" element={<ReportList />} />
        <Route path="/bi/informes/:id" element={<ReportViewer />} />
        <Route path="/bi/datasets" element={<DatasetManager />} />
        <Route path="/bi/alertas" element={<AlertManager />} />

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
    </BrowserRouter>
  );
}

export default App;
