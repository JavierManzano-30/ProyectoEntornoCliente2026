import React from 'react';
import Badge from '../../../../components/common/Badge';
import { getStatusLabel, getStatusColor } from '../../utils/ticketHelpers';

const TicketStatusBadge = ({ status }) => {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);

  return (
    <Badge variant={color}>
      {label}
    </Badge>
  );
};

export default TicketStatusBadge;
