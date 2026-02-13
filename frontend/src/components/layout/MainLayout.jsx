import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  AlertCircle,
  BarChart3,
  Sun,
  Moon,
  Users,
  Calendar,
  DollarSign,
  Building2,
  Shield,
  UserPlus,
  TrendingUp,
  Activity,
  FolderKanban,
  ListTodo,
  Clock,
  Package,
  ShoppingCart,
  FileText,
  Calculator,
} from "lucide-react";
import api from "../../lib/axios";
import { API_ENDPOINTS } from "../../config/api";
import "./MainLayout.css";

const MainLayout = ({ module = "soporte" }) => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = React.useState("Empresa");
  const [isExitingToMain, setIsExitingToMain] = React.useState(false);
  const exitTimeoutRef = React.useRef(null);

  React.useEffect(() => {
    let cancelled = false;

    const readStoredCompanyName = () => {
      const storedName = localStorage.getItem("companyName");
      if (storedName) return storedName;

      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return storedUser.companyName || storedUser.empresaNombre || "";
      } catch {
        return "";
      }
    };

    const loadCompanyName = async () => {
      const cachedName = readStoredCompanyName();
      if (cachedName && !cancelled) {
        setCompanyName(cachedName);
      }

      const companyId = localStorage.getItem("companyId");
      if (!companyId) return;

      try {
        const response = await api.get(API_ENDPOINTS.core.companyById(companyId));
        const realName = response?.data?.name;
        if (realName && !cancelled) {
          setCompanyName(realName);
          localStorage.setItem("companyName", realName);
        }
      } catch {
        if (!cachedName && !cancelled) {
          setCompanyName("Empresa");
        }
      }
    };

    loadCompanyName();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    document.body.classList.remove("module-transitioning");
  }, []);

  React.useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");
    localStorage.removeItem("roleId");
    localStorage.removeItem("user");
    navigate('/');
  };

  const handleBackToMain = (event) => {
    event.preventDefault();
    if (isExitingToMain) return;

    setIsExitingToMain(true);
    document.body.classList.add("main-transitioning");
    exitTimeoutRef.current = setTimeout(() => {
      navigate('/main');
    }, 260);
  };

  // Tema: iluminado/oscuro
  const [darkMode, setDarkMode] = React.useState(() => {
    try {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) return stored === 'true';
    } catch {
      /* ignore storage errors */
    }
    return document.body.classList.contains('dark-mode');
  });
  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle('dark-mode', next);
      try {
        localStorage.setItem('darkMode', next ? 'true' : 'false');
      } catch {
        /* ignore storage errors */
      }
      return next;
    });
  };
  const navigationConfig = {
    soporte: {
      title: "Módulo de Soporte",
      items: [
        {
          name: "Dashboard",
          href: "/soporte",
          icon: LayoutDashboard,
          exact: true,
        },
        { name: "Tickets", href: "/soporte/tickets", icon: Ticket },
        { name: "SLA", href: "/soporte/sla", icon: AlertCircle },
        { name: "Reportes", href: "/soporte/reportes", icon: BarChart3 },
        // { name: "Configuración", href: "/soporte/config", icon: Settings },
      ],
    },
    bi: {
      title: "Módulo BI",
      items: [
        { name: "Dashboard", href: "/bi", icon: LayoutDashboard, exact: true },
        { name: "Informes", href: "/bi/informes", icon: BarChart3 },
        { name: "Datasets", href: "/bi/datasets", icon: FolderKanban },
        { name: "Alertas", href: "/bi/alertas", icon: AlertCircle },
      ],
    },
    rrhh: {
      title: "Módulo RRHH",
      items: [
        { name: "Empleados", href: "/rrhh/empleados", icon: Users },
        { name: "Ausencias", href: "/rrhh/ausencias", icon: Calendar },
        { name: "Nóminas", href: "/rrhh/nominas", icon: DollarSign },
        { name: "Departamentos", href: "/rrhh/departamentos", icon: Building2 },
        // { name: "Configuración", href: "/rrhh/config", icon: Settings },
      ],
    },
    core: {
      title: "Módulo Core",
      items: [
        {
          name: "Dashboard",
          href: "/core",
          icon: LayoutDashboard,
          exact: true,
        },
        { name: "Usuarios", href: "/core/usuarios", icon: Users },
        { name: "Empresas", href: "/core/empresas", icon: Building2 },
        { name: "Roles", href: "/core/roles", icon: Shield },
      ],
    },
    crm: {
      title: "Módulo CRM",
      items: [
        { name: "Dashboard", href: "/crm", icon: LayoutDashboard, exact: true },
        { name: "Clientes", href: "/crm/clientes", icon: Users },
        { name: "Leads", href: "/crm/leads", icon: UserPlus },
        { name: "Oportunidades", href: "/crm/oportunidades", icon: TrendingUp },
        { name: "Actividades", href: "/crm/actividades", icon: Activity },
      ],
    },
    alm: {
      title: "Módulo ALM",
      items: [
        { name: "Proyectos", href: "/alm/proyectos", icon: FolderKanban },
        { name: "Tareas", href: "/alm/tareas", icon: ListTodo },
        { name: "Tiempos", href: "/alm/tiempos", icon: Clock },
      ],
    },
    bpm: {
      title: "Módulo BPM",
      items: [
        { name: "Dashboard", href: "/bpm", icon: LayoutDashboard, exact: true },
        { name: "Procesos", href: "/bpm/procesos", icon: FolderKanban },
        { name: "Tareas", href: "/bpm/tareas", icon: ListTodo },
      ],
    },
    erp: {
      title: "Módulo ERP",
      items: [
        { name: "Dashboard", href: "/erp", icon: LayoutDashboard, exact: true },
        { name: "Contabilidad", href: "/erp/contabilidad", icon: Calculator },
        { name: "Compras", href: "/erp/compras", icon: ShoppingCart },
        { name: "Ventas", href: "/erp/ventas", icon: FileText },
        { name: "Inventario", href: "/erp/inventario", icon: Package },
        { name: "Producción", href: "/erp/produccion", icon: Activity },
        { name: "Proyectos", href: "/erp/proyectos", icon: FolderKanban },
        { name: "Tesorería", href: "/erp/tesoreria", icon: DollarSign },
        { name: "Reportes", href: "/erp/reportes", icon: BarChart3 },
      ],
    },
  };

  const currentNav = navigationConfig[module] || navigationConfig.soporte;
  const navigation = currentNav.items;

  return (
    <div className={`main-layout${darkMode ? ' dark-mode' : ''}${isExitingToMain ? ' is-exiting' : ''}`}>
      <aside className="main-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo company-name">{companyName}</h1>
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
                  `nav-link ${isActive ? "active" : ""}`
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
            <h2 className="header-title header-title-blue">{currentNav.title}</h2>
            <div className="header-actions">
              <button
                type="button"
                className="header-module-link header-module-button"
                onClick={handleBackToMain}
              >
                Main
              </button>
              <NavLink to="/core" className="header-module-link">
                Core
              </NavLink>
              <NavLink to="/soporte" className="header-module-link">
                Soporte
              </NavLink>
              <NavLink to="/rrhh" className="header-module-link">
                RRHH
              </NavLink>
              <NavLink to="/crm" className="header-module-link">
                CRM
              </NavLink>
              <NavLink to="/alm" className="header-module-link">
                ALM
              </NavLink>
              <NavLink to="/bi" className="header-module-link">
                BI
              </NavLink>
              <NavLink to="/bpm" className="header-module-link">
                BPM
              </NavLink>
              <NavLink to="/erp" className="header-module-link">
                ERP
              </NavLink>
              <button className="header-button" onClick={handleToggleTheme} title="Cambiar modo de iluminación">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="header-button logout-btn" onClick={handleLogout} title="Cerrar sesión">
                Cerrar sesión
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
