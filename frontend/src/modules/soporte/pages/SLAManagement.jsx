/**
 * Página de Gestión de SLAs
 * Permite configurar y monitorear acuerdos de nivel de servicio
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Save,
  X,
} from 'lucide-react';
import { useSoporteContext } from '../context/SoporteContext';
import './SLAManagement.css';

const SLAManagement = () => {
  const { usuario, getSLAs } = useSoporteContext();
  const [slas, setSlas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSLA, setEditingSLA] = useState(null);
  const [stats, setStats] = useState({
    cumplimiento: 0,
    incumplimientos: 0,
    enRiesgo: 0,
  });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    prioridad: 'media',
    tiempoRespuesta: 4,
    tiempoResolucion: 24,
    unidadTiempoRespuesta: 'horas',
    unidadTiempoResolucion: 'horas',
    empresaId: '',
    departamentoId: '',
    activo: true,
  });

  useEffect(() => {
    loadSLAs();
    loadStats();
  }, [usuario.empresaId]);

  const loadSLAs = async () => {
    try {
      setLoading(true);
      const data = await getSLAs();
      setSlas(data);
    } catch (error) {
      console.error('Error al cargar SLAs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await soporteService.getSLAStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSLA) {
        await soporteService.updateSLA(editingSLA.id, formData);
      } else {
        await soporteService.createSLA(formData);
      }
      loadSLAs();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar SLA:', error);
    }
  };

  const handleEdit = (sla) => {
    setEditingSLA(sla);
    setFormData({
      nombre: sla.nombre,
      descripcion: sla.descripcion,
      prioridad: sla.prioridad,
      tiempoRespuesta: sla.tiempoRespuesta,
      tiempoResolucion: sla.tiempoResolucion,
      unidadTiempoRespuesta: sla.unidadTiempoRespuesta,
      unidadTiempoResolucion: sla.unidadTiempoResolucion,
      empresaId: sla.empresaId || '',
      departamentoId: sla.departamentoId || '',
      activo: sla.activo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este SLA?')) {
      try {
        await soporteService.deleteSLA(id);
        loadSLAs();
      } catch (error) {
        console.error('Error al eliminar SLA:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSLA(null);
    setFormData({
      nombre: '',
      descripcion: '',
      prioridad: 'media',
      tiempoRespuesta: 4,
      tiempoResolucion: 24,
      unidadTiempoRespuesta: 'horas',
      unidadTiempoResolucion: 'horas',
      empresaId: '',
      departamentoId: '',
      activo: true,
    });
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      critica: 'Crítica',
      alta: 'Alta',
      media: 'Media',
      baja: 'Baja',
    };
    return labels[priority] || priority;
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  if (loading) {
    return (
      <div className="sla-management">
        <div className="loading-state">
          <Clock className="loading-icon" />
          <p>Cargando SLAs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sla-management">
      <div className="sla-header">
        <div className="header-content">
          <h1>
            <Clock size={28} />
            Gestión de SLAs
          </h1>
          <p>Configure y monitoree los acuerdos de nivel de servicio</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Nuevo SLA
        </button>
      </div>

      {/* Estadísticas de cumplimiento */}
      <div className="sla-stats">
        <div className="stat-card success">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Cumplimiento</span>
            <span className="stat-value">{stats.cumplimiento}%</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">En Riesgo</span>
            <span className="stat-value">{stats.enRiesgo}</span>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Incumplimientos</span>
            <span className="stat-value">{stats.incumplimientos}</span>
          </div>
        </div>
      </div>

      {/* Lista de SLAs */}
      <div className="sla-list">
        {slas.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <h3>No hay SLAs configurados</h3>
            <p>Comience creando su primer acuerdo de nivel de servicio</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              Crear SLA
            </button>
          </div>
        ) : (
          <div className="sla-grid">
            {slas.map((sla) => (
              <div key={sla.id} className={`sla-card ${!sla.activo ? 'inactive' : ''}`}>
                <div className="sla-card-header">
                  <div className="sla-title">
                    <h3>{sla.nombre}</h3>
                    <span className={`priority-badge ${getPriorityClass(sla.prioridad)}`}>
                      {getPriorityLabel(sla.prioridad)}
                    </span>
                  </div>
                  <div className="sla-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(sla)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(sla.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="sla-description">{sla.descripcion}</p>

                <div className="sla-metrics">
                  <div className="metric">
                    <span className="metric-label">Tiempo de Respuesta</span>
                    <span className="metric-value">
                      {sla.tiempoRespuesta} {sla.unidadTiempoRespuesta}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Tiempo de Resolución</span>
                    <span className="metric-value">
                      {sla.tiempoResolucion} {sla.unidadTiempoResolucion}
                    </span>
                  </div>
                </div>

                {(sla.empresa || sla.departamento) && (
                  <div className="sla-scope">
                    {sla.empresa && <span className="scope-tag">🏢 {sla.empresa}</span>}
                    {sla.departamento && <span className="scope-tag">🏬 {sla.departamento}</span>}
                  </div>
                )}

                {!sla.activo && <div className="inactive-badge">Inactivo</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSLA ? 'Editar SLA' : 'Nuevo SLA'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="sla-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del SLA *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: SLA Soporte Premium"
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe el alcance del SLA..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prioridad">Prioridad *</label>
                  <select
                    id="prioridad"
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="empresaId">Empresa</label>
                  <input
                    type="text"
                    id="empresaId"
                    name="empresaId"
                    value={formData.empresaId}
                    onChange={handleInputChange}
                    placeholder="ID de empresa (opcional)"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tiempoRespuesta">Tiempo de Respuesta *</label>
                  <div className="input-group">
                    <input
                      type="number"
                      id="tiempoRespuesta"
                      name="tiempoRespuesta"
                      value={formData.tiempoRespuesta}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                    <select
                      name="unidadTiempoRespuesta"
                      value={formData.unidadTiempoRespuesta}
                      onChange={handleInputChange}
                    >
                      <option value="minutos">Minutos</option>
                      <option value="horas">Horas</option>
                      <option value="dias">Días</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tiempoResolucion">Tiempo de Resolución *</label>
                  <div className="input-group">
                    <input
                      type="number"
                      id="tiempoResolucion"
                      name="tiempoResolucion"
                      value={formData.tiempoResolucion}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                    <select
                      name="unidadTiempoResolucion"
                      value={formData.unidadTiempoResolucion}
                      onChange={handleInputChange}
                    >
                      <option value="minutos">Minutos</option>
                      <option value="horas">Horas</option>
                      <option value="dias">Días</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="departamentoId">Departamento</label>
                <input
                  type="text"
                  id="departamentoId"
                  name="departamentoId"
                  value={formData.departamentoId}
                  onChange={handleInputChange}
                  placeholder="ID de departamento (opcional)"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                  <span>SLA Activo</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  {editingSLA ? 'Guardar Cambios' : 'Crear SLA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLAManagement;
