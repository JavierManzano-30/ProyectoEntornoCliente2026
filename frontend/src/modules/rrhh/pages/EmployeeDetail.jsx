import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '../hooks/useEmployee';
import { useContracts } from '../hooks/useContracts';
import { useEvaluations } from '../hooks/useEvaluations';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { Edit, Mail, Phone, Calendar, Building2, FileText, Star } from 'lucide-react';
import { getFullName, formatSalary, getYearsOfService } from '../utils/employeeHelpers';
import { EMPLOYEE_STATUS_LABELS, EMPLOYEE_STATUS_COLORS } from '../constants/employeeStatus';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employee, loading, error, refetch } = useEmployee(id);
  const { contracts, activeContract } = useContracts(id);
  const { evaluations, latestEvaluation, calculateAverageScore } = useEvaluations(id);
  const [activeTab, setActiveTab] = useState('general');

  const handleEdit = () => {
    navigate(`/rrhh/empleados/${id}/editar`);
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando empleado..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;
  if (!employee) return <ErrorMessage message="Empleado no encontrado" fullScreen />;

  return (
    <div className="employee-detail-page">
      <PageHeader
        title={getFullName(employee)}
        subtitle={employee.position || 'Sin puesto'}
        actions={
          <Button variant="primary" icon={Edit} onClick={handleEdit}>
            Editar
          </Button>
        }
      />

      {/* Cabecera del empleado */}
      <Card padding="large" className="employee-header-card">
        <div className="employee-header-content">
          <div className="employee-avatar-large">
            {employee.firstName?.[0]}{employee.lastName?.[0]}
          </div>
          <div className="employee-header-info">
            <h2>{getFullName(employee)}</h2>
            <p className="employee-position">{employee.position || 'Sin puesto'}</p>
            <Badge variant={EMPLOYEE_STATUS_COLORS[employee.status]}>
              {EMPLOYEE_STATUS_LABELS[employee.status]}
            </Badge>
          </div>
          <div className="employee-header-stats">
            <div className="header-stat">
              <Calendar size={20} />
              <div>
                <span className="stat-label">Antigüedad</span>
                <span className="stat-value">{getYearsOfService(employee.hireDate)} años</span>
              </div>
            </div>
            <div className="header-stat">
              <Building2 size={20} />
              <div>
                <span className="stat-label">Departamento</span>
                <span className="stat-value">{employee.departmentName || 'Sin departamento'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pestañas */}
      <div className="employee-tabs">
        <button
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Información General
        </button>
        <button
          className={`tab-button ${activeTab === 'contract' ? 'active' : ''}`}
          onClick={() => setActiveTab('contract')}
        >
          Contrato
        </button>
        <button
          className={`tab-button ${activeTab === 'evaluations' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluations')}
        >
          Evaluaciones
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="employee-tab-content">
        {activeTab === 'general' && (
          <div className="tab-panel">
            <Card title="Datos Personales" padding="large">
              <div className="info-grid">
                <div className="info-item">
                  <Mail size={18} />
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{employee.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Phone size={18} />
                  <div>
                    <span className="info-label">Teléfono</span>
                    <span className="info-value">{employee.phone || '-'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText size={18} />
                  <div>
                    <span className="info-label">Número de Empleado</span>
                    <span className="info-value">{employee.employeeNumber}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar size={18} />
                  <div>
                    <span className="info-label">Fecha de Nacimiento</span>
                    <span className="info-value">
                      {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString('es-ES') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Información Laboral" padding="large" className="mt-4">
              <div className="info-grid">
                <div className="info-item">
                  <Calendar size={18} />
                  <div>
                    <span className="info-label">Fecha de Ingreso</span>
                    <span className="info-value">
                      {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('es-ES') : '-'}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <Building2 size={18} />
                  <div>
                    <span className="info-label">Departamento</span>
                    <span className="info-value">{employee.departmentName || '-'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText size={18} />
                  <div>
                    <span className="info-label">Puesto</span>
                    <span className="info-value">{employee.position || '-'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText size={18} />
                  <div>
                    <span className="info-label">Salario</span>
                    <span className="info-value">{formatSalary(employee.salary)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contract' && (
          <div className="tab-panel">
            <Card title="Contrato Activo" padding="large">
              {activeContract ? (
                <div className="contract-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Tipo de Contrato</span>
                      <span className="info-value">{activeContract.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Fecha de Inicio</span>
                      <span className="info-value">
                        {new Date(activeContract.startDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Fecha de Fin</span>
                      <span className="info-value">
                        {activeContract.endDate ? new Date(activeContract.endDate).toLocaleDateString('es-ES') : 'Indefinido'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Salario</span>
                      <span className="info-value">{formatSalary(activeContract.salary)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="empty-state">No hay contrato activo</p>
              )}
            </Card>

            {contracts.length > 1 && (
              <Card title="Historial de Contratos" padding="large" className="mt-4">
                <div className="contracts-timeline">
                  {contracts.map((contract, index) => (
                    <div key={contract.id} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>{contract.type}</h4>
                        <p>
                          {new Date(contract.startDate).toLocaleDateString('es-ES')} - 
                          {contract.endDate ? new Date(contract.endDate).toLocaleDateString('es-ES') : 'Actual'}
                        </p>
                        <p>{formatSalary(contract.salary)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="tab-panel">
            <Card title="Última Evaluación" padding="large">
              {latestEvaluation ? (
                <div className="evaluation-info">
                  <div className="evaluation-score">
                    <Star size={32} />
                    <span className="score-value">{calculateAverageScore(latestEvaluation)}</span>
                    <span className="score-label">Puntuación Media</span>
                  </div>
                  <div className="evaluation-date">
                    Evaluación del {new Date(latestEvaluation.evaluationDate).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ) : (
                <p className="empty-state">No hay evaluaciones registradas</p>
              )}
            </Card>

            {evaluations.length > 0 && (
              <Card title="Historial de Evaluaciones" padding="large" className="mt-4">
                <div className="evaluations-list">
                  {evaluations.map((evaluation) => (
                    <div key={evaluation.id} className="evaluation-item">
                      <div className="evaluation-item-date">
                        {new Date(evaluation.evaluationDate).toLocaleDateString('es-ES')}
                      </div>
                      <div className="evaluation-item-score">
                        Puntuación: {calculateAverageScore(evaluation)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
