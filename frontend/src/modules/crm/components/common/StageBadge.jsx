import React from 'react';
import Badge from '../../../../components/common/Badge';
import { OPPORTUNITY_STAGE_LABELS, OPPORTUNITY_STAGE_COLORS } from '../../constants/opportunityStages';

const StageBadge = ({ stage }) => {
  const label = OPPORTUNITY_STAGE_LABELS[stage] || stage;
  const variant = OPPORTUNITY_STAGE_COLORS[stage] || 'default';

  return <Badge variant={variant}>{label}</Badge>;
};

export default StageBadge;
