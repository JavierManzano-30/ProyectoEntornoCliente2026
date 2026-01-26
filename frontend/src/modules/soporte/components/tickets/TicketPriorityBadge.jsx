import React from 'react';
import Badge from '../../../../components/common/Badge';
import { getPriorityLabel, getPriorityColor } from '../../utils/ticketHelpers';
import { AlertCircle } from 'lucide-react';

const TicketPriorityBadge = ({ priority, showIcon = true }) => {
  const label = getPriorityLabel(priority);
  const color = getPriorityColor(priority);

  return (
    <Badge variant={color}>
      {showIcon && priority === 'critica' && <AlertCircle size={12} style={{ marginRight: '0.25rem' }} />}
      {label}
    </Badge>
  );
};

export default TicketPriorityBadge;
