import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { createProject, updateProject } from '../services/almService';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { Save, X } from 'lucide-react';
import './ProjectForm.css';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error } = useProject(id);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'planificacion',
    responsableId: 1,
    clienteId: 1,
    presupuesto: 0,
    horasEstimadas: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (project) {
      setFormData({
        nombre: project.nombre || '',
        descripcion: project.descripcion || '',
        fechaInicio: project.fechaInicio || '',
        fechaFin: project.fechaFin || '',
        estado: project.estado || 'planificacion',
        responsableId: project.responsableId || 1,
        clienteId: project.clienteId || 1,
        presupuesto: project.presupuesto || 0,
        horasEstimadas: project.horasEstimadas || 0
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setFormError(null);
      
      if (id) {
        await updateProject(id, formData);
      } else {
        await createProject(formData);
      }
      
      navigate('/alm/proyectos');
    } catch (err) {
      setFormError(err.message || 'Error al guardar proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && id) return <LoadingSpinner fullScreen />;
  if (error && id) return <ErrorMessage message={error} fullScreen />;

  return (
    <div className="project-form-page">
      <PageHeader
        title={id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        subtitle={id ? 'Modifica los datos del proyecto' : 'Completa el formulario para crear un nuevo proyecto'}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {formError && (
            <div className="form-error-message">{formError}</div>
          )}

          <div className="form-section">
            <h3 className="form-section-title">Información General</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Proyecto *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  placeholder="Ej: Rediseño Web Corporativa"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  rows="4"
                  placeholder="Describe los objetivos y detalles del proyecto"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado">Estado *</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="planificacion">Planificación</option>
                  <option value="en_curso">En Curso</option>
                  <option value="pausado">Pausado</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="responsableId">Responsable *</label>
                <select
                  id="responsableId"
                  name="responsableId"
                  value={formData.responsableId}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="1">Ana García</option>
                  <option value="2">Carlos Ruiz</option>
                  <option value="3">María López</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Cronograma</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaInicio">Fecha Inicio *</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaFin">Fecha Fin *</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Presupuesto y Estimación</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="presupuesto">Presupuesto (€) *</label>
                <input
                  type="number"
                  id="presupuesto"
                  name="presupuesto"
                  value={formData.presupuesto}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  min="0"
                  step="1000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="horasEstimadas">Horas Estimadas *</label>
                <input
                  type="number"
                  id="horasEstimadas"
                  name="horasEstimadas"
                  value={formData.horasEstimadas}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  min="0"
                  step="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="clienteId">Cliente *</label>
                <select
                  id="clienteId"
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="1">Tech Solutions SA</option>
                  <option value="2">Digital Commerce SL</option>
                  <option value="3">Innovate Corp</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              icon={X}
              onClick={() => navigate('/alm/proyectos')}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar Proyecto'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProjectForm;
