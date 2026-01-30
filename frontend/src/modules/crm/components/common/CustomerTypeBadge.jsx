import React from 'react';
import Badge from '../../../../components/common/Badge';
import { CUSTOMER_TYPE_LABELS, CUSTOMER_TYPE_COLORS } from '../../constants/customerStatuses';

const CustomerTypeBadge = ({ type }) => {
  const label = CUSTOMER_TYPE_LABELS[type] || type;
  const variant = CUSTOMER_TYPE_COLORS[type] || 'default';

  return <Badge variant={variant}>{label}</Badge>;
};

export default CustomerTypeBadge;
