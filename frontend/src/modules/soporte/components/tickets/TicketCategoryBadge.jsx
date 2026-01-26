import React from 'react';
import Badge from '../../../../components/common/Badge';
import { getCategoryLabel, getCategoryColor } from '../../utils/ticketHelpers';

const TicketCategoryBadge = ({ category }) => {
  const label = getCategoryLabel(category);
  const color = getCategoryColor(category);

  return (
    <Badge variant={color}>
      {label}
    </Badge>
  );
};

export default TicketCategoryBadge;
