import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import soporteService from '../services/soporteService';
import './TicketCreate.css';

const DEFAULT_CATEGORIES = [
  { id: 'technical', nombre: 'Tecnico' },
  { id: 'billing', nombre: 'Facturacion' },
  { id: 'other', nombre: 'Otro' },
];

const DEFAULT_PRIORITIES = [
  { id: 'low', nombre: 'Baja' },
  { id: 'medium', nombre: 'Media' },
  { id: 'high', nombre: 'Alta' },
  { id: 'urgent', nombre: 'Urgente' },
];

const INITIAL_FORM = {
  titulo: '',
  descripcion: '',
  categoria: '',
  prioridad: '',
};

const TicketCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [categorias, setCategorias] = useState(DEFAULT_CATEGORIES);
  const [prioridades, setPrioridades] = useState(DEFAULT_PRIORITIES);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        setCatalogError('');

        const [categoryData, priorityData] = await Promise.all([
          soporteService.getCategorias(),
          soporteService.getPrioridades(),
        ]);

        const validCategories = Array.isArray(categoryData) && categoryData.length > 0
          ? categoryData
          : DEFAULT_CATEGORIES;
        const validPriorities = Array.isArray(priorityData) && priorityData.length > 0
          ? priorityData
          : DEFAULT_PRIORITIES;

        setCategorias(validCategories);
        setPrioridades(validPriorities);

        setFormData((prev) => ({
          ...prev,
          categoria: prev.categoria || validCategories[0].id,
          prioridad: prev.prioridad || validPriorities.find((item) => item.id === 'medium')?.id || validPriorities[0].id,
        }));
      } catch (err) {
        const message = err.response?.data?.error?.message || err.response?.data?.message || 'Error al cargar el formulario';
        setCatalogError(message);
      } finally {
        setLoadingCatalogs(false);
      }
    };

    loadCatalogs();
  }, []);

  const selectedCategory = useMemo(
    () => categorias.find((item) => item.id === formData.categoria) || null,
    [categorias, formData.categoria]
  );

  const selectedPriority = useMemo(
    () => prioridades.find((item) => item.id === formData.prioridad) || null,
    [prioridades, formData.prioridad]
  );

  const validate = () => {
    const nextErrors = {};

    if (!formData.titulo.trim()) {
      nextErrors.titulo = 'El titulo es obligatorio';
    } else if (formData.titulo.trim().length < 5) {
      nextErrors.titulo = 'El titulo debe tener al menos 5 caracteres';
    }

    if (!formData.descripcion.trim()) {
      nextErrors.descripcion = 'La descripcion es obligatoria';
    } else if (formData.descripcion.trim().length < 10) {
      nextErrors.descripcion = 'La descripcion debe tener al menos 10 caracteres';
    }

    if (!formData.categoria) {
      nextErrors.categoria = 'Selecciona una categoria';
    }

    if (!formData.prioridad) {
      nextErrors.prioridad = 'Selecciona una prioridad';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');

      const createdTicket = await soporteService.createTicket({
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        prioridad: formData.prioridad,
      });

      if (createdTicket?.id) {
        navigate(`/soporte/tickets/${createdTicket.id}`);
        return;
      }

      navigate('/soporte/tickets');
    } catch (err) {
      const message = err.response?.data?.error?.message || err.response?.data?.message || 'No se pudo crear el ticket';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/soporte/tickets');
  };

  if (loadingCatalogs) {
    return <LoadingSpinner fullScreen text="Cargando formulario..." />;
  }

  if (catalogError) {
    return <ErrorMessage message={catalogError} onRetry={() => window.location.reload()} fullScreen />;
  }

  return (
    <div className="ticket-create-page">
      <PageHeader
        title="Nuevo Ticket"
        subtitle="Registra una incidencia o peticion para el equipo de soporte"
        breadcrumbs={[
          { label: 'Soporte', href: '/soporte' },
          { label: 'Tickets', href: '/soporte/tickets' },
          { label: 'Nuevo ticket' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {submitError && (
            <div className="ticket-create-submit-error">{submitError}</div>
          )}

          <div className="ticket-create-grid">
            <div className="ticket-create-form-group ticket-create-full-width">
              <label htmlFor="titulo">Titulo *</label>
              <input
                id="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleFieldChange('titulo')}
                maxLength={200}
                placeholder="Ej. No puedo acceder al CRM"
                disabled={submitting}
              />
              {errors.titulo && <p className="ticket-create-field-error">{errors.titulo}</p>}
            </div>

            <div className="ticket-create-form-group ticket-create-full-width">
              <label htmlFor="descripcion">Descripcion *</label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={handleFieldChange('descripcion')}
                placeholder="Describe el problema con el mayor detalle posible"
                rows={6}
                disabled={submitting}
              />
              {errors.descripcion && <p className="ticket-create-field-error">{errors.descripcion}</p>}
            </div>

            <div className="ticket-create-form-group">
              <label htmlFor="categoria">Categoria *</label>
              <select
                id="categoria"
                value={formData.categoria}
                onChange={handleFieldChange('categoria')}
                disabled={submitting}
              >
                {categorias.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre || item.id}
                  </option>
                ))}
              </select>
              {selectedCategory?.descripcion && (
                <p className="ticket-create-helper">{selectedCategory.descripcion}</p>
              )}
              {errors.categoria && <p className="ticket-create-field-error">{errors.categoria}</p>}
            </div>

            <div className="ticket-create-form-group">
              <label htmlFor="prioridad">Prioridad *</label>
              <select
                id="prioridad"
                value={formData.prioridad}
                onChange={handleFieldChange('prioridad')}
                disabled={submitting}
              >
                {prioridades.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre || item.id}
                  </option>
                ))}
              </select>
              {selectedPriority?.descripcion && (
                <p className="ticket-create-helper">{selectedPriority.descripcion}</p>
              )}
              {errors.prioridad && <p className="ticket-create-field-error">{errors.prioridad}</p>}
            </div>
          </div>

          <div className="ticket-create-actions">
            <Button
              type="button"
              variant="secondary"
              icon={X}
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              loading={submitting}
            >
              Crear Ticket
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TicketCreate;
