import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, TrendingUp, X } from 'lucide-react';
import CRMHeader from '../components/common/CRMHeader';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import crmService from '../services/crmService';
import './OpportunityForm.css';

const INITIAL_FORM = {
  nombre: '',
  clienteId: '',
  pipelineId: '',
  stageId: '',
  valor: '0',
  probabilidad: '0',
  fechaCierreEstimada: '',
  descripcion: '',
  responsableId: '',
  sortOrder: '0',
};

const OpportunityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [customers, setCustomers] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const currentPipeline = useMemo(
    () => pipelines.find((pipeline) => String(pipeline.id) === String(formData.pipelineId)) || null,
    [pipelines, formData.pipelineId]
  );

  const availableStages = useMemo(() => currentPipeline?.stages || [], [currentPipeline]);

  const pageTitle = useMemo(
    () => (isEditMode ? 'Editar Oportunidad' : 'Nueva Oportunidad'),
    [isEditMode]
  );

  const pageSubtitle = useMemo(
    () =>
      isEditMode
        ? 'Actualiza la oportunidad comercial'
        : 'Registra una nueva oportunidad en el pipeline',
    [isEditMode]
  );

  const toInputDate = (value) => {
    if (!value) return '';
    const asString = String(value);
    return asString.includes('T') ? asString.split('T')[0] : asString;
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const requests = [
        crmService.getCustomers(),
        crmService.getPipelines(),
      ];

      if (isEditMode) {
        requests.push(crmService.getOpportunityById(id));
      }

      const [customerRows, pipelineRows, opportunity] = await Promise.all(requests);
      const activePipelines = (pipelineRows || []).filter((pipeline) => pipeline.isActive !== false);
      setCustomers(customerRows || []);
      setPipelines(activePipelines);

      if (opportunity) {
        setFormData({
          nombre: opportunity.nombre || '',
          clienteId: opportunity.clienteId || '',
          pipelineId: opportunity.pipelineId || '',
          stageId: opportunity.stageId || '',
          valor: String(opportunity.valor ?? 0),
          probabilidad: String(opportunity.probabilidad ?? 0),
          fechaCierreEstimada: toInputDate(opportunity.fechaCierreEstimada),
          descripcion: opportunity.descripcion || '',
          responsableId: opportunity.responsableId || '',
          sortOrder: String(opportunity.sortOrder ?? 0),
        });
        return;
      }

      const defaultPipeline = activePipelines[0];
      const defaultStage = defaultPipeline?.stages?.[0];
      setFormData((prev) => ({
        ...prev,
        pipelineId: defaultPipeline?.id || '',
        stageId: defaultStage?.id || '',
        probabilidad:
          defaultStage?.defaultProbability !== undefined
            ? String(defaultStage.defaultProbability)
            : prev.probabilidad,
      }));
    } catch (error) {
      setLoadError(error.response?.data?.error?.message || error.message || 'Error al cargar el formulario');
    } finally {
      setLoading(false);
    }
  }, [id, isEditMode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const handlePipelineChange = (event) => {
    const pipelineId = event.target.value;
    const selectedPipeline = pipelines.find((pipeline) => String(pipeline.id) === String(pipelineId));
    const firstStage = selectedPipeline?.stages?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      pipelineId,
      stageId: firstStage?.id || '',
      probabilidad:
        firstStage?.defaultProbability !== undefined
          ? String(firstStage.defaultProbability)
          : prev.probabilidad,
    }));
    setErrors((prev) => ({ ...prev, pipelineId: '', stageId: '' }));
    setSubmitError('');
  };

  const handleStageChange = (event) => {
    const stageId = event.target.value;
    const selectedStage = availableStages.find((stage) => String(stage.id) === String(stageId));

    setFormData((prev) => ({
      ...prev,
      stageId,
      probabilidad:
        selectedStage?.defaultProbability !== undefined
          ? String(selectedStage.defaultProbability)
          : prev.probabilidad,
    }));
    setErrors((prev) => ({ ...prev, stageId: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio';
    if (!formData.clienteId) nextErrors.clienteId = 'Selecciona un cliente';
    if (!formData.pipelineId) nextErrors.pipelineId = 'Selecciona un pipeline';
    if (!formData.stageId) nextErrors.stageId = 'Selecciona una fase';

    const value = Number(formData.valor);
    if (!Number.isFinite(value) || value < 0) nextErrors.valor = 'Introduce un valor válido';

    const probability = Number(formData.probabilidad);
    if (!Number.isFinite(probability) || probability < 0 || probability > 100) {
      nextErrors.probabilidad = 'La probabilidad debe estar entre 0 y 100';
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
        clienteId: formData.clienteId,
        pipelineId: formData.pipelineId,
        stageId: formData.stageId,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        valor: Number(formData.valor || 0),
        probabilidad: Number(formData.probabilidad || 0),
        fechaCierreEstimada: formData.fechaCierreEstimada || null,
        responsableId: formData.responsableId.trim() || null,
        sortOrder: Number(formData.sortOrder || 0),
      };

      if (isEditMode) {
        await crmService.updateOpportunity(id, payload);
      } else {
        await crmService.createOpportunity(payload);
      }

      navigate('/crm/oportunidades');
    } catch (error) {
      setSubmitError(error.response?.data?.error?.message || error.message || 'No se pudo guardar la oportunidad');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/crm/oportunidades');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando formulario..." />;
  if (loadError) return <ErrorMessage message={loadError} onRetry={loadData} fullScreen />;

  return (
    <div className="crm-opportunity-form-page">
      <CRMHeader title={pageTitle} subtitle={pageSubtitle} icon={TrendingUp} />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {submitError && <div className="crm-opportunity-form-submit-error">{submitError}</div>}

          <div className="crm-opportunity-form-grid">
            <div className="crm-opportunity-form-group crm-opportunity-form-full-width">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleFieldChange('nombre')}
                disabled={submitting}
              />
              {errors.nombre && <p className="crm-opportunity-form-field-error">{errors.nombre}</p>}
            </div>

            <div className="crm-opportunity-form-group">
              <label htmlFor="clienteId">Cliente *</label>
              <select
                id="clienteId"
                value={formData.clienteId}
                onChange={handleFieldChange('clienteId')}
                disabled={submitting}
              >
                <option value="">Selecciona un cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.nombre}
                  </option>
                ))}
              </select>
              {errors.clienteId && <p className="crm-opportunity-form-field-error">{errors.clienteId}</p>}
            </div>

            <div className="crm-opportunity-form-group">
              <label htmlFor="pipelineId">Pipeline *</label>
              <select
                id="pipelineId"
                value={formData.pipelineId}
                onChange={handlePipelineChange}
                disabled={submitting}
              >
                <option value="">Selecciona un pipeline</option>
                {pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
              {errors.pipelineId && <p className="crm-opportunity-form-field-error">{errors.pipelineId}</p>}
            </div>

            <div className="crm-opportunity-form-group">
              <label htmlFor="stageId">Fase *</label>
              <select
                id="stageId"
                value={formData.stageId}
                onChange={handleStageChange}
                disabled={submitting || !formData.pipelineId}
              >
                <option value="">Selecciona una fase</option>
                {availableStages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
              {errors.stageId && <p className="crm-opportunity-form-field-error">{errors.stageId}</p>}
            </div>

            <div className="crm-opportunity-form-group">
              <label htmlFor="fechaCierreEstimada">Fecha de cierre estimada</label>
              <input
                id="fechaCierreEstimada"
                type="date"
                value={formData.fechaCierreEstimada}
                onChange={handleFieldChange('fechaCierreEstimada')}
                disabled={submitting}
              />
            </div>

            <div className="crm-opportunity-form-group">
              <label htmlFor="valor">Valor estimado (€) *</label>
              <input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                value={formData.valor}
                onChange={handleFieldChange('valor')}
                disabled={submitting}
              />
              {errors.valor && <p className="crm-opportunity-form-field-error">{errors.valor}</p>}
            </div>

            <div className="crm-opportunity-form-group">
              <label htmlFor="probabilidad">Probabilidad (%) *</label>
              <input
                id="probabilidad"
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.probabilidad}
                onChange={handleFieldChange('probabilidad')}
                disabled={submitting}
              />
              {errors.probabilidad && <p className="crm-opportunity-form-field-error">{errors.probabilidad}</p>}
            </div>

            <div className="crm-opportunity-form-group">
              <label htmlFor="responsableId">ID Responsable (opcional)</label>
              <input
                id="responsableId"
                type="text"
                value={formData.responsableId}
                onChange={handleFieldChange('responsableId')}
                disabled={submitting}
              />
            </div>

            <div className="crm-opportunity-form-group crm-opportunity-form-full-width">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={handleFieldChange('descripcion')}
                rows={4}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="crm-opportunity-form-actions">
            <Button type="button" variant="secondary" icon={X} onClick={handleCancel} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" icon={Save} loading={submitting}>
              {isEditMode ? 'Guardar Cambios' : 'Crear Oportunidad'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default OpportunityForm;
