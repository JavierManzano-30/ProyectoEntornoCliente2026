import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, TrendingUp, Clock } from 'lucide-react';
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '../../constants/projectStatus';
import { formatDate, formatBudget } from '../../utils/projectHelpers';
import Badge from '../../../../components/common/Badge';
import './ProjectCard.css';

const ProjectCard = ({ project, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(project);
    } else {
      navigate(`/alm/proyectos/${project.id}`);
    }
  };

  return (
    <div className="project-card" onClick={handleClick}>
      <div className="project-card-header">
        <h3 className="project-card-title">{project.nombre}</h3>
        <Badge 
          color={PROJECT_STATUS_COLORS[project.estado]}
          bgColor={PROJECT_STATUS_COLORS[project.estado] + '20'}
        >
          {PROJECT_STATUS_LABELS[project.estado]}
        </Badge>
      </div>
      
      <p className="project-card-description">{project.descripcion}</p>
      
      <div className="project-card-progress">
        <div className="progress-header">
          <span className="progress-label">Progreso</span>
          <span className="progress-value">{project.progreso}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${project.progreso}%` }}></div>
        </div>
        <span className="progress-tasks">{project.tareasCompletadas}/{project.tareasTotales} tareas</span>
      </div>
      
      <div className="project-card-meta">
        <div className="meta-item">
          <User size={16} />
          <span>{project.responsableNombre}</span>
        </div>
        <div className="meta-item">
          <Calendar size={16} />
          <span>{formatDate(project.fechaFin)}</span>
        </div>
      </div>
      
      <div className="project-card-footer">
        <div className="footer-item">
          <Clock size={16} />
          <span>{project.horasTrabajadas}h / {project.horasEstimadas}h</span>
        </div>
        <div className="footer-item">
          <TrendingUp size={16} />
          <span>{formatBudget(project.presupuesto)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
