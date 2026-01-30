import React from 'react';
import Card from '../../../../components/common/Card';
import { calculateCustomerStats } from '../../utils/customerHelpers';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import './CustomerStats.css';

const CustomerStats = ({ data }) => {
  const stats = calculateCustomerStats(data || []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statCards = [
    {
      title: 'Total Clientes',
      value: stats.total,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Clientes Activos',
      value: stats.activos,
      icon: UserCheck,
      color: 'green',
    },
    {
      title: 'Clientes Inactivos',
      value: stats.inactivos,
      icon: UserX,
      color: 'gray',
    },
    {
      title: 'Valor Total',
      value: formatCurrency(stats.valorTotal),
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  return (
    <div className="customer-stats">
      {statCards.map((stat, index) => (
        <Card key={index} className={`stat-card stat-card--${stat.color}`}>
          <div className="stat-card__content">
            <div className="stat-card__icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-card__info">
              <p className="stat-card__title">{stat.title}</p>
              <p className="stat-card__value">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomerStats;
