import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import ProjectCard from '../components/projects/ProjectCard';
import { Plus, Search, FolderKanban, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import './ProjectList.css';

const ProjectList = () => {
  const navigate = useNavigate();
  const { projects, filters, setFilters, stats, loading, error, refetch } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando proyectos..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  return (
    <div className="project-list-page">
      <PageHeader
        title="Proyectos"
        subtitle="Gestiona todos tus proyectos"
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/alm/proyectos/nuevo')}>
            Nuevo Proyecto
          </Button>
        }
      />

      <div className="project-metrics">
        <Card padding="medium" className="metric-card">
          <div className="metric-icon blue"><FolderKanban size={24} /></div>
          <div className="metric-inline">
            <span className="metric-value">{stats.total}</span>
            <span className="metric-label">Total Proyectos</span>
          </div>
        </Card>
        <Card padding="medium" className="metric-card">
          <div className="metric-icon green"><CheckCircle size={24} /></div>
          <div className="metric-inline">
            <span className="metric-value">{stats.activos}</span>
            <span className="metric-label">En Curso</span>
          </div>
        </Card>
        <Card padding="medium" className="metric-card">
          <div className="metric-icon orange"><Clock size={24} /></div>
          <div className="metric-inline">
            <span className="metric-value">{stats.horasTotales}h</span>
            <span className="metric-label">Horas Trabajadas</span>
          </div>
        </Card>
        <Card padding="medium" className="metric-card">
          <div className="metric-icon purple"><TrendingUp size={24} /></div>
          <div className="metric-inline">
            <span className="metric-value">{stats.completados}</span>
            <span className="metric-label">Completados</span>
          </div>
        </Card>
      </div>

      <Card padding="large">
        <div className="projects-header">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Buscar proyectos..." value={searchTerm} onChange={handleSearch} />
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban size={48} />
            <h3>No se encontraron proyectos</h3>
            <p>Crea tu primer proyecto para comenzar</p>
            <Button variant="primary" icon={Plus} onClick={() => navigate('/alm/proyectos/nuevo')}>
              Crear Proyecto
            </Button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProjectList;
