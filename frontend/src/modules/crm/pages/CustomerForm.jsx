import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Users } from 'lucide-react';
import CRMHeader from '../components/common/CRMHeader';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import crmService from '../services/crmService';
import './CustomerForm.css';

const INITIAL_FORM = {
  nombre: '',
  cif: '',
  email: '',
  telefono: '',
  ciudad: '',
  direccion: '',
  responsableId: '',
  notas: '',
  tipo: 'customer',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CustomerForm = () => {
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
    () => (isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'),
    [isEditMode]
  );

  const pageSubtitle = useMemo(
    () =>
      isEditMode
        ? 'Actualiza la información comercial del cliente'
        : 'Completa la información para registrar un nuevo cliente',
    [isEditMode]
  );

  const loadCustomer = useCallback(async () => {
    if (!isEditMode) return;

    try {
      setLoading(true);
      setLoadError('');
      const customer = await crmService.getCustomerById(id);
      setFormData({
        nombre: customer.nombre || '',
        cif: customer.cif || '',
        email: customer.email || '',
        telefono: customer.telefono || '',
        ciudad: customer.ciudad || '',
        direccion: customer.direccion || '',
        responsableId: customer.responsableId || '',
        notas: customer.notas || '',
        tipo: customer.tipo || 'customer',
      });
    } catch (error) {
      setLoadError(error.response?.data?.error?.message || error.message || 'Error al cargar el cliente');
    } finally {
      setLoading(false);
    }
  }, [id, isEditMode]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

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
        ciudad: formData.ciudad.trim() || null,
        direccion: formData.direccion.trim() || null,
        responsableId: formData.responsableId.trim() || null,
        notas: formData.notas.trim() || null,
        tipo: 'customer',
      };

      if (isEditMode) {
        await crmService.updateCustomer(id, payload);
      } else {
        await crmService.createCustomer(payload);
      }

      navigate('/crm/clientes');
    } catch (error) {
      setSubmitError(error.response?.data?.error?.message || error.message || 'No se pudo guardar el cliente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/crm/clientes');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando cliente..." />;
  if (loadError) return <ErrorMessage message={loadError} onRetry={loadCustomer} fullScreen />;

  return (
    <div className="crm-customer-form-page">
      <CRMHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        icon={Users}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {submitError && <div className="crm-customer-form-submit-error">{submitError}</div>}

          <div className="crm-customer-form-grid">
            <div className="crm-customer-form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange('nombre')}
                disabled={submitting}
              />
              {errors.nombre && <p className="crm-customer-form-field-error">{errors.nombre}</p>}
            </div>

            <div className="crm-customer-form-group">
              <label htmlFor="cif">CIF</label>
              <input
                id="cif"
                type="text"
                value={formData.cif}
                onChange={handleChange('cif')}
                disabled={submitting}
              />
            </div>

            <div className="crm-customer-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={submitting}
              />
              {errors.email && <p className="crm-customer-form-field-error">{errors.email}</p>}
            </div>

            <div className="crm-customer-form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="text"
                value={formData.telefono}
                onChange={handleChange('telefono')}
                disabled={submitting}
              />
            </div>

            <div className="crm-customer-form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                id="ciudad"
                type="text"
                value={formData.ciudad}
                onChange={handleChange('ciudad')}
                disabled={submitting}
              />
            </div>

            <div className="crm-customer-form-group">
              <label htmlFor="responsableId">ID Responsable (opcional)</label>
              <input
                id="responsableId"
                type="text"
                value={formData.responsableId}
                onChange={handleChange('responsableId')}
                disabled={submitting}
              />
            </div>

            <div className="crm-customer-form-group crm-customer-form-full-width">
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange('direccion')}
                disabled={submitting}
              />
            </div>

            <div className="crm-customer-form-group crm-customer-form-full-width">
              <label htmlFor="notas">Notas</label>
              <textarea
                id="notas"
                value={formData.notas}
                onChange={handleChange('notas')}
                rows={4}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="crm-customer-form-actions">
            <Button type="button" variant="secondary" icon={X} onClick={handleCancel} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" icon={Save} loading={submitting}>
              {isEditMode ? 'Guardar Cambios' : 'Crear Cliente'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CustomerForm;
