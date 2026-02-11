import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Headphones,
  Users,
  Briefcase,
  FolderKanban,
  BarChart3,
  Workflow,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./MainHub.css";

const modules = [
  {
    id: "core",
    title: "Core",
    subtitle: "Administracion central",
    description: "Gestiona usuarios, empresas, roles y configuracion global del sistema.",
    path: "/core",
    icon: Shield,
  },
  {
    id: "soporte",
    title: "Soporte",
    subtitle: "Mesa de ayuda",
    description: "Controla tickets, SLA, reportes y flujo operativo de incidencias.",
    path: "/soporte",
    icon: Headphones,
  },
  {
    id: "rrhh",
    title: "RRHH",
    subtitle: "Capital humano",
    description: "Administra empleados, ausencias, nominas y estructura organizativa.",
    path: "/rrhh",
    icon: Users,
  },
  {
    id: "crm",
    title: "CRM",
    subtitle: "Clientes y ventas",
    description: "Gestiona clientes, leads, oportunidades y actividad comercial.",
    path: "/crm",
    icon: Briefcase,
  },
  {
    id: "alm",
    title: "ALM",
    subtitle: "Proyectos y tareas",
    description: "Planifica proyectos, seguimiento de tareas y registro de tiempos.",
    path: "/alm",
    icon: FolderKanban,
  },
  {
    id: "bi",
    title: "BI",
    subtitle: "Analitica",
    description: "Visualiza dashboards, datasets, alertas e informes ejecutivos.",
    path: "/bi",
    icon: BarChart3,
  },
  {
    id: "bpm",
    title: "BPM",
    subtitle: "Procesos",
    description: "Orquesta procesos de negocio, tareas, instancias y cumplimiento SLA.",
    path: "/bpm",
    icon: Workflow,
  },
  {
    id: "erp",
    title: "ERP",
    subtitle: "Operacion empresarial",
    description: "Integra finanzas, compras, ventas, inventario y reportes operativos.",
    path: "/erp",
    icon: Building2,
  },
];

const MainHub = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);

  const scrollCards = (direction) => {
    if (!trackRef.current) return;
    const amount = direction === "left" ? -360 : 360;
    trackRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="main-hub-page">
      <header className="main-hub-header">
        <h1>Centro de Modulos</h1>
        <p>Selecciona un modulo para acceder a su funcionalidad principal.</p>
      </header>

      <section className="main-hub-carousel">
        <button
          type="button"
          className="carousel-control"
          onClick={() => scrollCards("left")}
          aria-label="Desplazar a la izquierda"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="carousel-track" ref={trackRef}>
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="module-card"
                onClick={() => navigate(item.path)}
              >
                <div className="module-card-inner">
                  <div className="module-card-face module-card-front">
                    <div className="module-icon-wrap">
                      <Icon size={28} />
                    </div>
                    <h2>{item.title}</h2>
                    <span>{item.subtitle}</span>
                  </div>

                  <div className="module-card-face module-card-back">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <strong>Click para entrar</strong>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="carousel-control"
          onClick={() => scrollCards("right")}
          aria-label="Desplazar a la derecha"
        >
          <ChevronRight size={20} />
        </button>
      </section>
    </div>
  );
};

export default MainHub;
