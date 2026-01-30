import React from 'react';
import Badge from '../../../../components/common/Badge';
import { getFullName, formatSalary } from '../../utils/employeeHelpers';
import { EMPLOYEE_STATUS_LABELS, EMPLOYEE_STATUS_COLORS } from '../../constants/employeeStatus';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onClick }) => {
  return (
    <div className="employee-card" onClick={() => onClick && onClick(employee.id)}>
      <div className="employee-card-header">
        <div className="employee-card-avatar">
          {employee.firstName?.[0]}{employee.lastName?.[0]}
        </div>
        <div className="employee-card-info">
          <h3 className="employee-card-name">{getFullName(employee)}</h3>
          <p className="employee-card-position">{employee.position || 'Sin puesto'}</p>
        </div>
        <Badge variant={EMPLOYEE_STATUS_COLORS[employee.status]}>
          {EMPLOYEE_STATUS_LABELS[employee.status]}
        </Badge>
      </div>
      
      <div className="employee-card-details">
        <div className="employee-card-detail">
          <span className="detail-label">Email</span>
          <span className="detail-value">{employee.email}</span>
        </div>
        <div className="employee-card-detail">
          <span className="detail-label">Departamento</span>
          <span className="detail-value">{employee.departmentName || 'Sin departamento'}</span>
        </div>
        <div className="employee-card-detail">
          <span className="detail-label">Salario</span>
          <span className="detail-value">{formatSalary(employee.salary)}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
