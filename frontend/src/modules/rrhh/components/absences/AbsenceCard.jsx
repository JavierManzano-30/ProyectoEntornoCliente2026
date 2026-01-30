import React from 'react';
import Badge from '../../../../components/common/Badge';
import { ABSENCE_TYPE_LABELS, ABSENCE_STATUS_LABELS, ABSENCE_STATUS_COLORS } from '../../constants/absenceTypes';
import { calculateWorkDays } from '../../utils/absenceCalculations';
import './AbsenceCard.css';

const AbsenceCard = ({ absence, onApprove, onReject }) => {
  const workDays = calculateWorkDays(absence.startDate, absence.endDate);

  return (
    <div className="absence-card">
      <div className="absence-card-header">
        <div>
          <h4 className="absence-card-title">{ABSENCE_TYPE_LABELS[absence.type]}</h4>
          <p className="absence-card-employee">{absence.employeeName}</p>
        </div>
        <Badge variant={ABSENCE_STATUS_COLORS[absence.status]}>
          {ABSENCE_STATUS_LABELS[absence.status]}
        </Badge>
      </div>

      <div className="absence-card-dates">
        <div className="absence-date-item">
          <span className="date-label">Desde</span>
          <span className="date-value">{new Date(absence.startDate).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="absence-date-item">
          <span className="date-label">Hasta</span>
          <span className="date-value">{new Date(absence.endDate).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="absence-date-item">
          <span className="date-label">Días laborables</span>
          <span className="date-value">{workDays}</span>
        </div>
      </div>

      {absence.reason && (
        <div className="absence-card-reason">
          <span className="reason-label">Motivo:</span>
          <p className="reason-text">{absence.reason}</p>
        </div>
      )}

      {absence.status === 'pending' && (onApprove || onReject) && (
        <div className="absence-card-actions">
          {onApprove && (
            <button className="absence-btn absence-btn-approve" onClick={() => onApprove(absence.id)}>
              Aprobar
            </button>
          )}
          {onReject && (
            <button className="absence-btn absence-btn-reject" onClick={() => onReject(absence.id)}>
              Rechazar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AbsenceCard;
