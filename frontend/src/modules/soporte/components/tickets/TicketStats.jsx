import React from 'react';
import { calculateTicketStats } from '../../utils/ticketHelpers';
import Card from '../../../../components/common/Card';
import { Ticket, Clock, CheckCircle, XCircle, AlertTriangle, UserX } from 'lucide-react';
import './TicketStats.css';

const TicketStats = ({ data }) => {
  const stats = calculateTicketStats(data);

  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      icon: Ticket,
      color: 'blue',
    },
    {
      label: 'Pendientes',
      value: stats.pendiente,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'En Progreso',
      value: stats.enProgreso,
      icon: AlertTriangle,
      color: 'blue',
    },
    {
      label: 'Resueltos',
      value: stats.resuelto,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Críticos',
      value: stats.criticos,
      icon: AlertTriangle,
      color: 'red',
    },
    {
      label: 'Sin Asignar',
      value: stats.sinAsignar,
      icon: UserX,
      color: 'gray',
    },
  ];

  return (
    <div className="ticket-stats">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} padding="medium" className="stat-card">
            <div className="stat-content">
              <div className={`stat-icon stat-icon-${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TicketStats;
