import React from 'react';
import { Phone, Mail, Users, CheckSquare, FileText, Calendar } from 'lucide-react';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';

const iconMap = {
  [ACTIVITY_TYPES.LLAMADA]: Phone,
  call: Phone,
  [ACTIVITY_TYPES.EMAIL]: Mail,
  email: Mail,
  [ACTIVITY_TYPES.REUNION]: Users,
  meeting: Users,
  [ACTIVITY_TYPES.TAREA]: CheckSquare,
  task: CheckSquare,
  [ACTIVITY_TYPES.NOTA]: FileText,
  note: FileText,
  [ACTIVITY_TYPES.CITA]: Calendar,
  appointment: Calendar,
};

const ActivityTypeIcon = ({ type, size = 20, className = '' }) => {
  const Icon = iconMap[type] || FileText;

  return <Icon size={size} className={className} />;
};

export default ActivityTypeIcon;
