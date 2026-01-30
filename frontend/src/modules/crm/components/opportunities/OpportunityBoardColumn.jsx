import React from 'react';
import OpportunityCard from './OpportunityCard';
import { OPPORTUNITY_STAGE_LABELS } from '../../constants/opportunityStages';
import './OpportunityBoardColumn.css';

const OpportunityBoardColumn = ({ stage, opportunities, onCardClick }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.valor || 0), 0);

  return (
    <div className="opportunity-column">
      <div className="opportunity-column__header">
        <div className="opportunity-column__title">
          <h3>{OPPORTUNITY_STAGE_LABELS[stage] || stage}</h3>
          <span className="opportunity-column__count">{opportunities.length}</span>
        </div>
        <div className="opportunity-column__total">
          {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="opportunity-column__cards">
        {opportunities.length === 0 ? (
          <div className="opportunity-column__empty">
            <p>No hay oportunidades</p>
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onClick={() => onCardClick(opportunity.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OpportunityBoardColumn;
