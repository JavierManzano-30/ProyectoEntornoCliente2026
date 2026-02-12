import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { ABSENCE_TYPE_OPTIONS } from '../constants/absenceTypes';
import { calculateWorkDays, validateAbsenceData } from '../utils/absenceCalculations';
import { createAbsence, getEmployees } from '../services/rrhhService';
import './AbsenceForm.css';

const INITIAL_FORM = {
  employeeId: '',
  type: '',
  startDate: '',
  endDate: '',
  notes: '',
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const AbsenceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    startDate: getTodayDate(),
    endDate: getTodayDate(),
  });
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const rows = await getEmployees();
        const orderedRows = [...rows].sort((a, b) => {
          const aName = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
          const bName = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
          return aName.localeCompare(bName);
        });

        setEmployees(orderedRows);

        if (orderedRows.length > 0) {
          setFormData((prev) => ({
            ...prev,
            employeeId: prev.employeeId || String(orderedRows[0].id),
            type: prev.type || ABSENCE_TYPE_OPTIONS[0]?.value || '',
          }));
        }
      } catch (error) {
        setLoadError(error.response?.data?.error?.message || error.message || 'Error al cargar el formulario');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => String(employee.id) === String(formData.employeeId)),
    [employees, formData.employeeId]
  );

  const totalWorkDays = useMemo(
    () => calculateWorkDays(formData.startDate, formData.endDate),
    [formData.startDate, formData.endDate]
  );

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { isValid, errors: validationErrors } = validateAbsenceData(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');

      const newAbsence = await createAbsence({
        employeeId: formData.employeeId,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes.trim() || null,
      });

      navigate('/rrhh/ausencias', { state: { createdAbsenceId: newAbsence.id } });
    } catch (error) {
      setSubmitError(error.response?.data?.error?.message || error.message || 'No se pudo crear la ausencia');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/rrhh/ausencias');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando formulario..." />;
  if (loadError) return <ErrorMessage message={loadError} fullScreen />;

  return (
    <div className="absence-form-page">
      <PageHeader
        title="Nueva Ausencia"
        subtitle="Registra una nueva solicitud de ausencia para un empleado"
        breadcrumbs={[
          { label: 'RRHH', href: '/rrhh/empleados' },
          { label: 'Ausencias', href: '/rrhh/ausencias' },
          { label: 'Nueva' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {submitError && <div className="absence-form-submit-error">{submitError}</div>}

          <div className="absence-form-grid">
            <div className="absence-form-group absence-form-full-width">
              <label htmlFor="employeeId">Empleado *</label>
              <select
                id="employeeId"
                value={formData.employeeId}
                onChange={handleChange('employeeId')}
                disabled={submitting || employees.length === 0}
              >
                {employees.length === 0 && <option value="">No hay empleados disponibles</option>}
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {`${employee.firstName || ''} ${employee.lastName || ''}`.trim()} - {employee.email}
                  </option>
                ))}
              </select>
              {errors.employeeId && <p className="absence-form-field-error">{errors.employeeId}</p>}
            </div>

            <div className="absence-form-group">
              <label htmlFor="type">Tipo de ausencia *</label>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange('type')}
                disabled={submitting}
              >
                <option value="">Selecciona un tipo</option>
                {ABSENCE_TYPE_OPTIONS.map((typeOption) => (
                  <option key={typeOption.value} value={typeOption.value}>
                    {typeOption.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="absence-form-field-error">{errors.type}</p>}
            </div>

            <div className="absence-form-group">
              <label htmlFor="startDate">Fecha inicio *</label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                disabled={submitting}
              />
              {errors.startDate && <p className="absence-form-field-error">{errors.startDate}</p>}
            </div>

            <div className="absence-form-group">
              <label htmlFor="endDate">Fecha fin *</label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                disabled={submitting}
              />
              {errors.endDate && <p className="absence-form-field-error">{errors.endDate}</p>}
            </div>

            <div className="absence-form-group">
              <label>Días laborables</label>
              <div className="absence-form-days-box">
                {Number.isFinite(totalWorkDays) && totalWorkDays > 0 ? `${totalWorkDays} días` : '0 días'}
              </div>
            </div>

            <div className="absence-form-group absence-form-full-width">
              <label htmlFor="notes">Notas (opcional)</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                rows={4}
                placeholder={selectedEmployee ? `Notas para ${selectedEmployee.firstName || 'el empleado'}` : 'Añade información adicional'}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="absence-form-actions">
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
              disabled={employees.length === 0}
            >
              Crear Ausencia
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default AbsenceForm;
