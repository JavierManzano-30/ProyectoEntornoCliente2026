import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Páginas del módulo de soporte
import SupportDashboard from './modules/soporte/pages/SupportDashboard';
import TicketList from './modules/soporte/pages/TicketList';
import TicketDetail from './modules/soporte/pages/TicketDetail';

import './App.css';

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
          <Route path="sla" element={<div style={{padding: '2rem'}}>Página SLA (Próximamente)</div>} />
          <Route path="reportes" element={<div style={{padding: '2rem'}}>Página Reportes (Próximamente)</div>} />
          <Route path="config" element={<div style={{padding: '2rem'}}>Configuración (Próximamente)</div>} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<div style={{padding: '2rem', textAlign: 'center'}}>Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
