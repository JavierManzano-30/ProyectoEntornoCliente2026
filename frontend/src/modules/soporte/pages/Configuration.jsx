/**
 * Página de Configuración del Módulo de Soporte
 * Gestión de tablones por empresa/departamento, categorías, prioridades y notificaciones
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Save,
  Building2,
  Briefcase,
  Tag,
  AlertTriangle,
  Bell,
  Users,
  Layers,
  Palette,
  Type,
  Clock,
  Zap,
  Mail,
  MessageSquare,
} from 'lucide-react';
import soporteService from '../services/soporteService';
import { useSoporteContext } from '../context/SoporteContext';
import './Configuration.css';

const Configuration = () => {
  const { usuario } = useSoporteContext();
  const [activeTab, setActiveTab] = useState('tablones');
  const [loading, setLoading] = useState(false);

  // Estados para tablones
  const [tablones, setTablenes] = useState([]);
  const [showTablonModal, setShowTablonModal] = useState(false);
  const [editingTablon, setEditingTablon] = useState(null);

  // Estados para categorías
  const [categorias, setCategorias] = useState([]);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);

  // Estados para prioridades
  const [prioridades, setPrioridades] = useState([]);

  // Estados para estados personalizados
  const [estadosPersonalizados, setEstadosPersonalizados] = useState([]);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  // Estados para campos personalizados
  const [camposPersonalizados, setCamposPersonalizados] = useState([]);
  const [showCampoModal, setShowCampoModal] = useState(false);

  // Estados para plantillas
  const [plantillas, setPlantillas] = useState([]);
  const [showPlantillaModal, setShowPlantillaModal] = useState(false);

  // Estados para tema/colores
  const [temaConfig, setTemaConfig] = useState({
    colorPrimario: '#3b82f6',
    colorSecundario: '#10b981',
    colorExito: '#10b981',
    colorAdvertencia: '#f59e0b',
    colorPeligro: '#ef4444',
    colorInfo: '#0ea5e9',
  });

  // Estados para horarios
  const [horariosConfig, setHorariosConfig] = useState({
    horaInicio: '09:00',
    horaFin: '18:00',
    diasLaborables: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
  });

  // Estados para reglas de escalamiento
  const [reglasEscalamiento, setReglasEscalamiento] = useState([]);

  // Estados para notificaciones
  const [notificaciones, setNotificaciones] = useState({
    emailNuevoTicket: true,
    emailAsignacion: true,
    emailCambioEstado: true,
    emailComentario: true,
    emailEscalamiento: true,
    slaAlerta: true,
    slaVencimiento: true,
  });

  const [tablonForm, setTablonForm] = useState({
    nombre: '',
    descripcion: '',
    empresaId: '',
    empresaNombre: '',
    departamentoId: '',
    departamentoNombre: '',
    color: '#3b82f6',
    icono: '📋',
    activo: true,
  });

  const [categoriaForm, setCategoriaForm] = useState({
    nombre: '',
    descripcion: '',
    color: '#3b82f6',
    icono: '📁',
  });

  useEffect(() => {
    loadConfiguration();
  }, [activeTab, usuario.empresaId]);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      if (activeTab === 'tablones') {
        const data = await soporteService.getTablenes(usuario.empresaId);
        setTablenes(data);
      } else if (activeTab === 'categorias') {
        const data = await soporteService.getCategorias();
        setCategorias(data);
      } else if (activeTab === 'prioridades') {
        const data = await soporteService.getPrioridades();
        setPrioridades(data);
      } else if (activeTab === 'notificaciones') {
        const data = await soporteService.getNotificaciones();
        setNotificaciones(data);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para tablones
  const handleSaveTablon = async (e) => {
    e.preventDefault();
    try {
      if (editingTablon) {
        await soporteService.updateTablon(editingTablon.id, tablonForm);
      } else {
        await soporteService.createTablon(tablonForm);
      }
      loadConfiguration();
      setShowTablonModal(false);
      resetTablonForm();
    } catch (error) {
      console.error('Error al guardar tablón:', error);
    }
  };

  const handleEditTablon = (tablon) => {
    setEditingTablon(tablon);
    setTablonForm(tablon);
    setShowTablonModal(true);
  };

  const handleDeleteTablon = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este tablón?')) {
      try {
        await soporteService.deleteTablon(id);
        loadConfiguration();
      } catch (error) {
        console.error('Error al eliminar tablón:', error);
      }
    }
  };

  const resetTablonForm = () => {
    setTablonForm({
      nombre: '',
      descripcion: '',
      empresaId: '',
      empresaNombre: '',
      departamentoId: '',
      departamentoNombre: '',
      color: '#3b82f6',
      icono: '📋',
      activo: true,
    });
    setEditingTablon(null);
  };

  // Funciones para categorías
  const handleSaveCategoria = async (e) => {
    e.preventDefault();
    try {
      await soporteService.createCategoria(categoriaForm);
      loadConfiguration();
      setShowCategoriaModal(false);
      resetCategoriaForm();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleDeleteCategoria = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await soporteService.deleteCategoria(id);
        loadConfiguration();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  const resetCategoriaForm = () => {
    setCategoriaForm({
      nombre: '',
      descripcion: '',
      color: '#3b82f6',
      icono: '📁',
    });
  };

  // Funciones para notificaciones
  const handleNotificationChange = async (key, value) => {
    const newNotifications = { ...notificaciones, [key]: value };
    setNotificaciones(newNotifications);
    try {
      await soporteService.updateNotificaciones(newNotifications);
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
    }
  };

  const tabs = [
    { id: 'tablones', label: 'Tablones', icon: <Layers size={18} /> },
    { id: 'categorias', label: 'Categorías', icon: <Tag size={18} /> },
    { id: 'prioridades', label: 'Prioridades', icon: <AlertTriangle size={18} /> },
    { id: 'estados', label: 'Estados', icon: <Zap size={18} /> },
    { id: 'campos', label: 'Campos Personalizados', icon: <Type size={18} /> },
    { id: 'plantillas', label: 'Plantillas', icon: <MessageSquare size={18} /> },
    { id: 'tema', label: 'Tema y Colores', icon: <Palette size={18} /> },
    { id: 'horarios', label: 'Horarios', icon: <Clock size={18} /> },
    { id: 'notificaciones', label: 'Notificaciones', icon: <Bell size={18} /> },
  ];

  return (
    <div className="configuration-page">
      <div className="config-header">
        <div className="header-content">
          <h1>
            <Settings size={28} />
            Configuración del Módulo de Soporte
          </h1>
          <p>Administra tablones, categorías, prioridades y notificaciones</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="config-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de Tablones */}
      {activeTab === 'tablones' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Tablones de Soporte</h2>
              <p>Configure tablones específicos por empresa y departamento</p>
            </div>
            <button className="btn-primary" onClick={() => setShowTablonModal(true)}>
              <Plus size={18} />
              Nuevo Tablón
            </button>
          </div>

          <div className="tablones-grid">
            {tablones.length === 0 ? (
              <div className="empty-state">
                <Layers size={48} />
                <h3>No hay tablones configurados</h3>
                <p>Cree tablones personalizados para diferentes empresas o departamentos</p>
              </div>
            ) : (
              tablones.map((tablon) => (
                <div key={tablon.id} className="tablon-card">
                  <div className="tablon-header" style={{ borderLeftColor: tablon.color }}>
                    <span className="tablon-icon">{tablon.icono}</span>
                    <div className="tablon-info">
                      <h3>{tablon.nombre}</h3>
                      <p>{tablon.descripcion}</p>
                    </div>
                    <div className="tablon-actions">
                      <button className="btn-icon" onClick={() => handleEditTablon(tablon)}>
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDeleteTablon(tablon.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="tablon-details">
                    {tablon.empresaNombre && (
                      <div className="detail-item">
                        <Building2 size={16} />
                        <span>{tablon.empresaNombre}</span>
                      </div>
                    )}
                    {tablon.departamentoNombre && (
                      <div className="detail-item">
                        <Briefcase size={16} />
                        <span>{tablon.departamentoNombre}</span>
                      </div>
                    )}
                    {!tablon.activo && <span className="badge-inactive">Inactivo</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal de Tablón */}
          {showTablonModal && (
            <div className="modal-overlay" onClick={() => setShowTablonModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingTablon ? 'Editar Tablón' : 'Nuevo Tablón'}</h2>
                </div>

                <form onSubmit={handleSaveTablon} className="config-form">
                  <div className="form-group">
                    <label>Nombre del Tablón *</label>
                    <input
                      type="text"
                      value={tablonForm.nombre}
                      onChange={(e) =>
                        setTablonForm({ ...tablonForm, nombre: e.target.value })
                      }
                      required
                      placeholder="Ej: Soporte TI - Empresa A"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      value={tablonForm.descripcion}
                      onChange={(e) =>
                        setTablonForm({ ...tablonForm, descripcion: e.target.value })
                      }
                      rows="3"
                      placeholder="Describe el propósito del tablón..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Empresa</label>
                      <input
                        type="text"
                        value={tablonForm.empresaNombre}
                        onChange={(e) =>
                          setTablonForm({ ...tablonForm, empresaNombre: e.target.value })
                        }
                        placeholder="Nombre de la empresa"
                      />
                    </div>

                    <div className="form-group">
                      <label>Departamento</label>
                      <input
                        type="text"
                        value={tablonForm.departamentoNombre}
                        onChange={(e) =>
                          setTablonForm({ ...tablonForm, departamentoNombre: e.target.value })
                        }
                        placeholder="Nombre del departamento"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Color</label>
                      <input
                        type="color"
                        value={tablonForm.color}
                        onChange={(e) =>
                          setTablonForm({ ...tablonForm, color: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Icono</label>
                      <input
                        type="text"
                        value={tablonForm.icono}
                        onChange={(e) =>
                          setTablonForm({ ...tablonForm, icono: e.target.value })
                        }
                        maxLength="2"
                        placeholder="📋"
                      />
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={tablonForm.activo}
                        onChange={(e) =>
                          setTablonForm({ ...tablonForm, activo: e.target.checked })
                        }
                      />
                      <span>Tablón activo</span>
                    </label>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowTablonModal(false);
                        resetTablonForm();
                      }}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={18} />
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenido de Categorías */}
      {activeTab === 'categorias' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Categorías de Tickets</h2>
              <p>Gestiona las categorías para clasificar los tickets</p>
            </div>
            <button className="btn-primary" onClick={() => setShowCategoriaModal(true)}>
              <Plus size={18} />
              Nueva Categoría
            </button>
          </div>

          <div className="categorias-list">
            {categorias.length === 0 ? (
              <div className="empty-state">
                <Tag size={48} />
                <h3>No hay categorías configuradas</h3>
                <p>Cree categorías para organizar mejor los tickets</p>
              </div>
            ) : (
              categorias.map((cat) => (
                <div key={cat.id} className="categoria-item">
                  <span className="cat-icon" style={{ backgroundColor: cat.color }}>
                    {cat.icono}
                  </span>
                  <div className="cat-info">
                    <h4>{cat.nombre}</h4>
                    <p>{cat.descripcion}</p>
                  </div>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDeleteCategoria(cat.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Modal de Categoría */}
          {showCategoriaModal && (
            <div className="modal-overlay" onClick={() => setShowCategoriaModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Nueva Categoría</h2>
                </div>

                <form onSubmit={handleSaveCategoria} className="config-form">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={categoriaForm.nombre}
                      onChange={(e) =>
                        setCategoriaForm({ ...categoriaForm, nombre: e.target.value })
                      }
                      required
                      placeholder="Ej: Hardware"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      value={categoriaForm.descripcion}
                      onChange={(e) =>
                        setCategoriaForm({ ...categoriaForm, descripcion: e.target.value })
                      }
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Color</label>
                      <input
                        type="color"
                        value={categoriaForm.color}
                        onChange={(e) =>
                          setCategoriaForm({ ...categoriaForm, color: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Icono</label>
                      <input
                        type="text"
                        value={categoriaForm.icono}
                        onChange={(e) =>
                          setCategoriaForm({ ...categoriaForm, icono: e.target.value })
                        }
                        maxLength="2"
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowCategoriaModal(false);
                        resetCategoriaForm();
                      }}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={18} />
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenido de Prioridades */}
      {activeTab === 'prioridades' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Prioridades</h2>
              <p>Niveles de prioridad para los tickets</p>
            </div>
          </div>

          <div className="prioridades-list">
            {prioridades.map((prior) => (
              <div key={prior.id} className={`prioridad-item priority-${prior.nivel}`}>
                <AlertTriangle size={20} />
                <div className="prior-info">
                  <h4>{prior.nombre}</h4>
                  <p>SLA: {prior.slaHoras}h</p>
                </div>
                <span className="prior-badge">{prior.nivel}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Notificaciones */}
      {activeTab === 'notificaciones' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Notificaciones</h2>
              <p>Configure las alertas y notificaciones del sistema</p>
            </div>
          </div>

          <div className="notifications-settings">
            <div className="notification-section">
              <h3>
                <Bell size={20} />
                Notificaciones por Email
              </h3>
              <div className="notification-options">
                {[
                  { key: 'emailNuevoTicket', label: 'Nuevo ticket creado' },
                  { key: 'emailAsignacion', label: 'Ticket asignado' },
                  { key: 'emailCambioEstado', label: 'Cambio de estado' },
                  { key: 'emailComentario', label: 'Nuevo comentario' },
                  { key: 'emailEscalamiento', label: 'Ticket escalado' },
                ].map((opt) => (
                  <label key={opt.key} className="notification-option">
                    <input
                      type="checkbox"
                      checked={notificaciones[opt.key]}
                      onChange={(e) => handleNotificationChange(opt.key, e.target.checked)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="notification-section">
              <h3>
                <AlertTriangle size={20} />
                Alertas de SLA
              </h3>
              <div className="notification-options">
                {[
                  { key: 'slaAlerta', label: 'Alerta de SLA próximo a vencer (80%)' },
                  { key: 'slaVencimiento', label: 'SLA vencido' },
                ].map((opt) => (
                  <label key={opt.key} className="notification-option">
                    <input
                      type="checkbox"
                      checked={notificaciones[opt.key]}
                      onChange={(e) => handleNotificationChange(opt.key, e.target.checked)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Estados Personalizados */}
      {activeTab === 'estados' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Estados Personalizados</h2>
              <p>Define estados específicos para el flujo de trabajo de tu empresa</p>
            </div>
            <button className="btn-primary" onClick={() => setShowEstadoModal(true)}>
              <Plus size={18} />
              Nuevo Estado
            </button>
          </div>

          <div className="estados-grid">
            {[
              { id: 1, nombre: 'Nuevo', color: '#3b82f6', orden: 1, tipo: 'inicial' },
              { id: 2, nombre: 'Asignado', color: '#8b5cf6', orden: 2, tipo: 'proceso' },
              { id: 3, nombre: 'En Proceso', color: '#f59e0b', orden: 3, tipo: 'proceso' },
              { id: 4, nombre: 'Esperando Cliente', color: '#06b6d4', orden: 4, tipo: 'espera' },
              { id: 5, nombre: 'Resuelto', color: '#10b981', orden: 5, tipo: 'final' },
              { id: 6, nombre: 'Cerrado', color: '#6b7280', orden: 6, tipo: 'final' },
            ].map((estado) => (
              <div key={estado.id} className="estado-card" style={{ borderLeftColor: estado.color }}>
                <div className="estado-header">
                  <div className="estado-color" style={{ backgroundColor: estado.color }} />
                  <div>
                    <h4>{estado.nombre}</h4>
                    <span className="estado-tipo">{estado.tipo}</span>
                  </div>
                </div>
                <div className="estado-actions">
                  <button className="btn-icon">
                    <Edit2 size={14} />
                  </button>
                  <button className="btn-icon danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Campos Personalizados */}
      {activeTab === 'campos' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Campos Personalizados</h2>
              <p>Añade campos adicionales para recopilar información específica</p>
            </div>
            <button className="btn-primary" onClick={() => setShowCampoModal(true)}>
              <Plus size={18} />
              Nuevo Campo
            </button>
          </div>

          <div className="campos-list">
            {[
              { id: 1, nombre: 'Número de Empleado', tipo: 'texto', requerido: true, tablon: 'RRHH' },
              { id: 2, nombre: 'Equipo Afectado', tipo: 'seleccion', requerido: false, tablon: 'TI' },
              { id: 3, nombre: 'Urgencia', tipo: 'seleccion', requerido: true, tablon: 'Todos' },
              { id: 4, nombre: 'Costo Estimado', tipo: 'numero', requerido: false, tablon: 'Finanzas' },
            ].map((campo) => (
              <div key={campo.id} className="campo-item">
                <Type size={20} className="campo-icon" />
                <div className="campo-info">
                  <h4>{campo.nombre}</h4>
                  <div className="campo-meta">
                    <span className="campo-badge">{campo.tipo}</span>
                    {campo.requerido && <span className="campo-badge required">Requerido</span>}
                    <span className="campo-tablon">Tablón: {campo.tablon}</span>
                  </div>
                </div>
                <div className="campo-actions">
                  <button className="btn-icon">
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Plantillas */}
      {activeTab === 'plantillas' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Plantillas de Respuesta</h2>
              <p>Respuestas predefinidas para agilizar la atención</p>
            </div>
            <button className="btn-primary" onClick={() => setShowPlantillaModal(true)}>
              <Plus size={18} />
              Nueva Plantilla
            </button>
          </div>

          <div className="plantillas-grid">
            {[
              {
                id: 1,
                nombre: 'Confirmación de Ticket',
                asunto: 'Ticket #{id} - Recibido',
                contenido: 'Hemos recibido tu solicitud y la estamos revisando...',
                categoria: 'General',
              },
              {
                id: 2,
                nombre: 'Solicitar Información',
                asunto: 'Re: Ticket #{id} - Necesitamos más información',
                contenido: 'Para poder ayudarte mejor, necesitamos que nos proporciones...',
                categoria: 'Seguimiento',
              },
              {
                id: 3,
                nombre: 'Resolución Completada',
                asunto: 'Ticket #{id} - Resuelto',
                contenido: 'Tu solicitud ha sido resuelta. Por favor confirma...',
                categoria: 'Cierre',
              },
            ].map((plantilla) => (
              <div key={plantilla.id} className="plantilla-card">
                <div className="plantilla-header">
                  <MessageSquare size={20} />
                  <span className="plantilla-categoria">{plantilla.categoria}</span>
                </div>
                <h4>{plantilla.nombre}</h4>
                <p className="plantilla-asunto">{plantilla.asunto}</p>
                <p className="plantilla-preview">{plantilla.contenido}</p>
                <div className="plantilla-actions">
                  <button className="btn-secondary btn-sm">
                    <Edit2 size={14} />
                    Editar
                  </button>
                  <button className="btn-icon danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Tema y Colores */}
      {activeTab === 'tema' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Tema y Colores</h2>
              <p>Personaliza los colores del sistema para cada tablón</p>
            </div>
            <button className="btn-primary" onClick={() => alert('Guardar tema')}>
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>

          <div className="tema-config">
            <div className="tema-section">
              <h3>Colores Principales</h3>
              <div className="color-grid">
                {[
                  { key: 'colorPrimario', label: 'Color Primario', value: temaConfig.colorPrimario },
                  { key: 'colorSecundario', label: 'Color Secundario', value: temaConfig.colorSecundario },
                  { key: 'colorExito', label: 'Color Éxito', value: temaConfig.colorExito },
                  { key: 'colorAdvertencia', label: 'Color Advertencia', value: temaConfig.colorAdvertencia },
                  { key: 'colorPeligro', label: 'Color Peligro', value: temaConfig.colorPeligro },
                  { key: 'colorInfo', label: 'Color Info', value: temaConfig.colorInfo },
                ].map((color) => (
                  <div key={color.key} className="color-picker-group">
                    <label>{color.label}</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={color.value}
                        onChange={(e) =>
                          setTemaConfig({ ...temaConfig, [color.key]: e.target.value })
                        }
                        className="color-picker"
                      />
                      <span className="color-value">{color.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tema-preview">
              <h3>Vista Previa</h3>
              <div className="preview-container">
                <div className="preview-ticket" style={{ borderTopColor: temaConfig.colorPrimario }}>
                  <div className="preview-header" style={{ background: temaConfig.colorPrimario }}>
                    <span>Ticket #1234</span>
                  </div>
                  <div className="preview-body">
                    <span className="preview-badge" style={{ background: temaConfig.colorExito }}>
                      Resuelto
                    </span>
                    <span className="preview-badge" style={{ background: temaConfig.colorAdvertencia }}>
                      Media
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de Horarios */}
      {activeTab === 'horarios' && (
        <div className="config-content">
          <div className="content-header">
            <div>
              <h2>Horarios de Atención</h2>
              <p>Define los horarios laborables para cálculo de SLAs</p>
            </div>
            <button className="btn-primary" onClick={() => alert('Guardar horarios')}>
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>

          <div className="horarios-config">
            <div className="horario-section">
              <h3>Horario Laboral</h3>
              <div className="horario-inputs">
                <div className="form-group">
                  <label>Hora de Inicio</label>
                  <input
                    type="time"
                    value={horariosConfig.horaInicio}
                    onChange={(e) =>
                      setHorariosConfig({ ...horariosConfig, horaInicio: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Hora de Fin</label>
                  <input
                    type="time"
                    value={horariosConfig.horaFin}
                    onChange={(e) =>
                      setHorariosConfig({ ...horariosConfig, horaFin: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="horario-section">
              <h3>Días Laborables</h3>
              <div className="dias-grid">
                {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(
                  (dia) => (
                    <label key={dia} className="dia-checkbox">
                      <input
                        type="checkbox"
                        checked={horariosConfig.diasLaborables.includes(dia)}
                        onChange={(e) => {
                          const newDias = e.target.checked
                            ? [...horariosConfig.diasLaborables, dia]
                            : horariosConfig.diasLaborables.filter((d) => d !== dia);
                          setHorariosConfig({ ...horariosConfig, diasLaborables: newDias });
                        }}
                      />
                      <span>{dia.charAt(0).toUpperCase() + dia.slice(1)}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="horario-section">
              <h3>Días Festivos</h3>
              <div className="festivos-list">
                <p className="info-text">
                  Los días festivos se excluirán del cálculo de SLAs. Próximamente podrás
                  configurarlos aquí.
                </p>
                <button className="btn-secondary">
                  <Plus size={16} />
                  Añadir Día Festivo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuration;
