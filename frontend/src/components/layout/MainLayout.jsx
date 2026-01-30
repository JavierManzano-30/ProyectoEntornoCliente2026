import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, AlertCircle, BarChart3, Settings, Users, Calendar, DollarSign, Building2, UserPlus, TrendingUp, Activity } from 'lucide-react';
import './MainLayout.css';

const MainLayout = ({ module = 'soporte' }) => {
  const navigationConfig = {
    soporte: {
      title: 'Módulo de Soporte',
      items: [
        { name: 'Dashboard', href: '/soporte', icon: LayoutDashboard, exact: true },
        { name: 'Tickets', href: '/soporte/tickets', icon: Ticket },
        { name: 'SLA', href: '/soporte/sla', icon: AlertCircle },
        { name: 'Reportes', href: '/soporte/reportes', icon: BarChart3 },
        { name: 'Configuración', href: '/soporte/config', icon: Settings },
      ],
    },
    rrhh: {
      title: 'Módulo RRHH',
      items: [
        { name: 'Empleados', href: '/rrhh/empleados', icon: Users },
        { name: 'Ausencias', href: '/rrhh/ausencias', icon: Calendar },
        { name: 'Nóminas', href: '/rrhh/nominas', icon: DollarSign },
        { name: 'Departamentos', href: '/rrhh/departamentos', icon: Building2 },
        { name: 'Configuración', href: '/rrhh/config', icon: Settings },
      ],
    },
    crm: {
      title: 'Módulo CRM',
      items: [
        { name: 'Dashboard', href: '/crm', icon: LayoutDashboard, exact: true },
        { name: 'Clientes', href: '/crm/clientes', icon: Users },
        { name: 'Leads', href: '/crm/leads', icon: UserPlus },
        { name: 'Oportunidades', href: '/crm/oportunidades', icon: TrendingUp },
        { name: 'Actividades', href: '/crm/actividades', icon: Activity },
      ],
    },
  };

  const currentNav = navigationConfig[module] || navigationConfig.soporte;
  const navigation = currentNav.items;

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
            <h2 className="header-title">{currentNav.title}</h2>
            <div className="header-actions">
              <NavLink to="/soporte" className="header-module-link">Soporte</NavLink>
              <NavLink to="/rrhh" className="header-module-link">RRHH</NavLink>
              <NavLink to="/crm" className="header-module-link">CRM</NavLink>
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
