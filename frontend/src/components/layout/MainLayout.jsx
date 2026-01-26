import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, AlertCircle, BarChart3, Settings } from 'lucide-react';
import './MainLayout.css';

const MainLayout = () => {
  const navigation = [
    { name: 'Dashboard', href: '/soporte', icon: LayoutDashboard, exact: true },
    { name: 'Tickets', href: '/soporte/tickets', icon: Ticket },
    { name: 'SLA', href: '/soporte/sla', icon: AlertCircle },
    { name: 'Reportes', href: '/soporte/reportes', icon: BarChart3 },
    { name: 'Configuración', href: '/soporte/config', icon: Settings },
  ];

  return (
    <div className="main-layout">
      <aside className="main-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">ERP</h1>
          <p className="sidebar-subtitle">Sistema de Gestión</p>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.exact}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="main-content">
        <header className="main-header">
          <div className="header-content">
            <h2 className="header-title">Módulo de Soporte</h2>
            <div className="header-actions">
              <button className="header-button">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="main-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
