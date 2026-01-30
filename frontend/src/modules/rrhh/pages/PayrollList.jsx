import React, { useState } from 'react';
import { usePayrolls } from '../hooks/usePayrolls';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { Download, Filter, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPayrollPeriod, calculateNetAmount, generatePayrollFilename } from '../utils/payrollFormatters';
import './PayrollList.css';

const PayrollList = () => {
  const {
    payrolls,
    loading,
    error,
    downloading,
    filters,
    setFilters,
    stats,
    handleDownloadPDF,
    refetch,
  } = usePayrolls();

  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const onDownload = async (payroll) => {
    const filename = generatePayrollFilename(payroll);
    await handleDownloadPDF(payroll.id, filename);
  };

  if (loading) return <LoadingSpinner fullScreen text="Cargando nóminas..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} fullScreen />;

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i);
  }

  const metrics = [
    {
      label: 'Total Nóminas',
      value: stats?.total || 0,
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Total Bruto',
      value: formatCurrency(stats?.totalGross || 0),
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Total Neto',
      value: formatCurrency(stats?.totalNet || 0),
      icon: DollarSign,
      color: 'purple',
    },
    {
      label: 'Media Bruta',
      value: formatCurrency(stats?.averageGross || 0),
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  return (
    <div className="payroll-list-page">
      <PageHeader
        title="Nóminas"
        subtitle="Consulta y descarga las nóminas de los empleados"
      />

      {/* Métricas */}
      <div className="payroll-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} padding="medium" className="payroll-metric-card">
              <div className="metric-content">
                <div className={`metric-icon metric-icon-${metric.color}`}>
                  <Icon size={24} />
                </div>
                <div className="metric-info">
                  <p className="metric-label">{metric.label}</p>
                  <p className="metric-value">{metric.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <Card padding="medium" className="payroll-filters-card">
        <div className="filters-header">
          <h3>Filtros</h3>
          <Button
            variant="secondary"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>

        {showFilters && (
          <div className="filters-grid">
            <div className="filter-item">
              <label>Año</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">Todos</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <label>Mes</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
              >
                <option value="">Todos</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>
                    {new Date(2000, month - 1).toLocaleString('es-ES', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Lista de nóminas */}
      <Card padding="none" className="payroll-table-card">
        <div className="table-container">
          <table className="payroll-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Período</th>
                <th>Bruto</th>
                <th>Deducciones</th>
                <th>Neto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.length > 0 ? (
                payrolls.map((payroll) => (
                  <tr key={payroll.id} className="payroll-row">
                    <td>
                      <div className="employee-info">
                        <span className="employee-name">{payroll.employeeName || '-'}</span>
                        <span className="employee-number">#{payroll.employeeNumber}</span>
                      </div>
                    </td>
                    <td>{formatPayrollPeriod(payroll)}</td>
                    <td>{formatCurrency(payroll.grossAmount)}</td>
                    <td>{formatCurrency(payroll.deductions)}</td>
                    <td className="net-amount">{formatCurrency(calculateNetAmount(payroll))}</td>
                    <td>
                      <Button
                        variant="secondary"
                        size="small"
                        icon={Download}
                        onClick={() => onDownload(payroll)}
                        disabled={downloading}
                      >
                        Descargar PDF
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <p>No se encontraron nóminas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PayrollList;
