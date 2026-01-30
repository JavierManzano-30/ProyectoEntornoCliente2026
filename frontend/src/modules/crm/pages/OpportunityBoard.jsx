import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp } from 'lucide-react';
import { useOpportunities } from '../hooks/useOpportunities';
import OpportunityBoardColumn from '../components/opportunities/OpportunityBoardColumn';
import CRMHeader from '../components/common/CRMHeader';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { OPPORTUNITY_STAGES } from '../constants/opportunityStages';
import './OpportunityBoard.css';

const OpportunityBoard = () => {
  const navigate = useNavigate();
  const { 
    groupedOpportunities,
    loading, 
    error, 
    refetch,
    updateStage
  } = useOpportunities();

  const handleCreateOpportunity = () => {
    navigate('/crm/oportunidades/nueva');
  };

  const handleCardClick = (id) => {
    navigate(`/crm/oportunidades/${id}`);
  };

  const handleStageChange = async (opportunityId, newStage) => {
    try {
      await updateStage(opportunityId, newStage);
    } catch (err) {
      console.error('Error al cambiar la fase:', err);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando oportunidades..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const stageOrder = [
    OPPORTUNITY_STAGES.PROSPECTO,
    OPPORTUNITY_STAGES.CALIFICACION,
    OPPORTUNITY_STAGES.PROPUESTA,
    OPPORTUNITY_STAGES.NEGOCIACION,
    OPPORTUNITY_STAGES.GANADA,
  ];

  return (
    <div className="opportunity-board-page">
      <CRMHeader
        title="Pipeline de Ventas"
        subtitle="Tablero Kanban de oportunidades"
        icon={TrendingUp}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleCreateOpportunity}>
            Nueva Oportunidad
          </Button>
        }
      />

      <div className="opportunity-board">
        {stageOrder.map((stage) => (
          <OpportunityBoardColumn
            key={stage}
            stage={stage}
            opportunities={groupedOpportunities[stage] || []}
            onCardClick={handleCardClick}
            onStageChange={handleStageChange}
          />
        ))}
      </div>
    </div>
  );
};

export default OpportunityBoard;
