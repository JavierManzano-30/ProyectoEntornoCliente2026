import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { createEmployee, getDepartments, getEmployee, updateEmployee } from '../services/rrhhService';
import { EMPLOYEE_STATUS_OPTIONS } from '../constants/employeeStatus';
import './EmployeeForm.css';

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  status: 'active',
  hireDate: '',
  departmentId: '',
  userId: '',
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({ ...INITIAL_FORM, hireDate: getTodayDate() });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const pageTitle = useMemo(
    () => (isEditMode ? 'Editar Empleado' : 'Nuevo Empleado'),
    [isEditMode]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const requests = [getDepartments()];
        if (isEditMode) {
          requests.push(getEmployee(id));
        }

        const [departmentRows, employeeData] = await Promise.all(requests);
        setDepartments(departmentRows || []);

        if (employeeData) {
          setFormData({
            firstName: employeeData.firstName || '',
            lastName: employeeData.lastName || '',
            email: employeeData.email || '',
            status: employeeData.status || 'active',
            hireDate: employeeData.hireDate ? String(employeeData.hireDate).split('T')[0] : getTodayDate(),
            departmentId: employeeData.departmentId || '',
            userId: employeeData.userId || '',
          });
        } else if (departmentRows?.length) {
          setFormData((prev) => ({
            ...prev,
            departmentId: prev.departmentId || String(departmentRows[0].id),
          }));
        }
      } catch (error) {
        setLoadError(error.response?.data?.error?.message || error.message || 'Error al cargar el formulario');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.firstName.trim()) nextErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) nextErrors.lastName = 'Los apellidos son obligatorios';

    if (!formData.email.trim()) {
      nextErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'El email no es válido';
    }

    if (!formData.hireDate) nextErrors.hireDate = 'La fecha de incorporación es obligatoria';
    if (!formData.departmentId) nextErrors.departmentId = 'Selecciona un departamento';

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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        status: formData.status,
        hireDate: formData.hireDate,
        departmentId: formData.departmentId,
        userId: formData.userId.trim() || null,
      };

      const savedEmployee = isEditMode
        ? await updateEmployee(id, payload)
        : await createEmployee(payload);

      navigate(`/rrhh/empleados/${savedEmployee.id}`);
    } catch (error) {
      setSubmitError(error.response?.data?.error?.message || error.message || 'No se pudo guardar el empleado');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/rrhh/empleados/${id}`);
      return;
    }
    navigate('/rrhh/empleados');
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando formulario..." />;
  if (loadError) return <ErrorMessage message={loadError} fullScreen />;

  return (
    <div className="employee-form-page">
      <PageHeader
        title={pageTitle}
        subtitle={isEditMode ? 'Actualiza los datos del empleado' : 'Completa la información para dar de alta un empleado'}
        breadcrumbs={[
          { label: 'RRHH', href: '/rrhh/empleados' },
          { label: 'Empleados', href: '/rrhh/empleados' },
          { label: isEditMode ? 'Editar' : 'Nuevo' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {submitError && <div className="employee-form-submit-error">{submitError}</div>}

          <div className="employee-form-grid">
            <div className="employee-form-group">
              <label htmlFor="firstName">Nombre *</label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                disabled={submitting}
              />
              {errors.firstName && <p className="employee-form-field-error">{errors.firstName}</p>}
            </div>

            <div className="employee-form-group">
              <label htmlFor="lastName">Apellidos *</label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                disabled={submitting}
              />
              {errors.lastName && <p className="employee-form-field-error">{errors.lastName}</p>}
            </div>

            <div className="employee-form-group">
              <label htmlFor="email">Email corporativo *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={submitting}
              />
              {errors.email && <p className="employee-form-field-error">{errors.email}</p>}
            </div>

            <div className="employee-form-group">
              <label htmlFor="status">Estado *</label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange('status')}
                disabled={submitting}
              >
                {EMPLOYEE_STATUS_OPTIONS.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="employee-form-group">
              <label htmlFor="hireDate">Fecha de incorporación *</label>
              <input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange('hireDate')}
                disabled={submitting}
              />
              {errors.hireDate && <p className="employee-form-field-error">{errors.hireDate}</p>}
            </div>

            <div className="employee-form-group">
              <label htmlFor="departmentId">Departamento *</label>
              <select
                id="departmentId"
                value={formData.departmentId}
                onChange={handleChange('departmentId')}
                disabled={submitting}
              >
                <option value="">Selecciona un departamento</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && <p className="employee-form-field-error">{errors.departmentId}</p>}
            </div>

            <div className="employee-form-group employee-form-full-width">
              <label htmlFor="userId">ID de usuario vinculado (opcional)</label>
              <input
                id="userId"
                type="text"
                value={formData.userId}
                onChange={handleChange('userId')}
                placeholder="UUID del usuario del módulo Core"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="employee-form-actions">
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
              {isEditMode ? 'Guardar Cambios' : 'Crear Empleado'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default EmployeeForm;
