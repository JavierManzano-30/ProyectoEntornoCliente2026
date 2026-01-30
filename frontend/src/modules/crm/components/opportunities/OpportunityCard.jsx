import React from 'react';
import Card from '../../../../components/common/Card';
import StageBadge from '../common/StageBadge';
import { OPPORTUNITY_PRIORITY_LABELS, OPPORTUNITY_PRIORITY_COLORS } from '../../constants/opportunityStages';
import Badge from '../../../../components/common/Badge';
import { Calendar, TrendingUp, User } from 'lucide-react';
import './OpportunityCard.css';

const OpportunityCard = ({ opportunity, onClick }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="opportunity-card" onClick={onClick}>
      <div className="opportunity-card__header">
        <h3 className="opportunity-card__title">{opportunity.nombre}</h3>
        <StageBadge stage={opportunity.fase} />
      </div>

      <p className="opportunity-card__description">{opportunity.descripcion}</p>

      <div className="opportunity-card__details">
        <div className="opportunity-card__detail">
          <User size={16} className="opportunity-card__icon" />
          <span>{opportunity.cliente?.nombre || 'Sin cliente'}</span>
        </div>
        
        <div className="opportunity-card__detail">
          <TrendingUp size={16} className="opportunity-card__icon" />
          <span className="opportunity-card__value">
            {formatCurrency(opportunity.valor)}
          </span>
          <span className="opportunity-card__probability">
            ({opportunity.probabilidad}%)
          </span>
        </div>

        <div className="opportunity-card__detail">
          <Calendar size={16} className="opportunity-card__icon" />
          <span>{formatDate(opportunity.fechaCierreEstimada)}</span>
        </div>
      </div>

      <div className="opportunity-card__footer">
        <Badge 
          variant={OPPORTUNITY_PRIORITY_COLORS[opportunity.prioridad] || 'default'}
          size="small"
        >
          {OPPORTUNITY_PRIORITY_LABELS[opportunity.prioridad] || opportunity.prioridad}
        </Badge>
        
        <span className="opportunity-card__owner">
          {opportunity.responsable?.nombre || 'Sin asignar'}
        </span>
      </div>
    </Card>
  );
};

export default OpportunityCard;
