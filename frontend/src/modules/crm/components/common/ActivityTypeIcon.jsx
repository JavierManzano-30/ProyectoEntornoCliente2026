import React from 'react';
import { Phone, Mail, Users, CheckSquare, FileText, Calendar } from 'lucide-react';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';

const iconMap = {
  [ACTIVITY_TYPES.LLAMADA]: Phone,
  [ACTIVITY_TYPES.EMAIL]: Mail,
  [ACTIVITY_TYPES.REUNION]: Users,
  [ACTIVITY_TYPES.TAREA]: CheckSquare,
  [ACTIVITY_TYPES.NOTA]: FileText,
  [ACTIVITY_TYPES.CITA]: Calendar,
};

const ActivityTypeIcon = ({ type, size = 20, className = '' }) => {
  const Icon = iconMap[type] || FileText;

  return <Icon size={size} className={className} />;
};

export default ActivityTypeIcon;
