import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, UserPlus, X } from 'lucide-react';
import CRMHeader from '../components/common/CRMHeader';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import crmService from '../services/crmService';
import './LeadForm.css';

const INITIAL_FORM = {
  nombre: '',
  cif: '',
  email: '',
  telefono: '',
  responsableId: '',
  descripcion: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const pageTitle = useMemo(
    () => (isEditMode ? 'Editar Lead' : 'Nuevo Lead'),
    [isEditMode]
  );

  const pageSubtitle = useMemo(
    () =>
      isEditMode
        ? 'Actualiza los datos del lead'
        : 'Completa la información para crear un nuevo lead',
    [isEditMode]
  );

  const loadLead = useCallback(async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      setLoadError('');
      const lead = await crmService.getLeadById(id);
      setFormData({
        nombre: lead.nombre || '',
        cif: lead.cif || '',
        email: lead.email || '',
        telefono: lead.telefono || '',
        responsableId: lead.responsableId || '',
        descripcion: lead.descripcion || '',
      });
    } catch (error) {
      setLoadError(error.response?.data?.error?.message || error.message || 'Error al cargar el lead');
    } finally {
      setLoading(false);
    }
  }, [id, isEditMode]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = 'El email no es válido';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setSubmitError('');

      const payload = {
        nombre: formData.nombre.trim(),
        cif: formData.cif.trim() || null,
        email: formData.email.trim() || null,
        telefono: formData.telefono.trim() || null,
        responsableId: formData.responsableId.trim() || null,
        descripcion: formData.descripcion.trim() || null,
      };

      if (isEditMode) {
        await crmService.updateLead(id, payload);
      } else {
        await crmService.createLead(payload);
      }

      navigate('/crm/leads');
    } catch (error) {
      setSubmitError(error.response?.data?.error?.message || error.message || 'No se pudo guardar el lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/crm/leads');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando lead..." />;
  if (loadError) return <ErrorMessage message={loadError} onRetry={loadLead} fullScreen />;

  return (
    <div className="crm-lead-form-page">
      <CRMHeader title={pageTitle} subtitle={pageSubtitle} icon={UserPlus} />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {submitError && <div className="crm-lead-form-submit-error">{submitError}</div>}

          <div className="crm-lead-form-grid">
            <div className="crm-lead-form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange('nombre')}
                disabled={submitting}
              />
              {errors.nombre && <p className="crm-lead-form-field-error">{errors.nombre}</p>}
            </div>

            <div className="crm-lead-form-group">
              <label htmlFor="cif">CIF</label>
              <input
                id="cif"
                type="text"
                value={formData.cif}
                onChange={handleChange('cif')}
                disabled={submitting}
              />
            </div>

            <div className="crm-lead-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={submitting}
              />
              {errors.email && <p className="crm-lead-form-field-error">{errors.email}</p>}
            </div>

            <div className="crm-lead-form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                value={formData.telefono}
                onChange={handleChange('telefono')}
                disabled={submitting}
              />
            </div>

            <div className="crm-lead-form-group crm-lead-form-full-width">
              <label htmlFor="responsableId">ID Responsable (opcional)</label>
              <input
                id="responsableId"
                type="text"
                value={formData.responsableId}
                onChange={handleChange('responsableId')}
                disabled={submitting}
              />
            </div>

            <div className="crm-lead-form-group crm-lead-form-full-width">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={handleChange('descripcion')}
                rows={4}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="crm-lead-form-actions">
            <Button type="button" variant="secondary" icon={X} onClick={handleCancel} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" icon={Save} loading={submitting}>
              {isEditMode ? 'Guardar Cambios' : 'Crear Lead'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default LeadForm;
