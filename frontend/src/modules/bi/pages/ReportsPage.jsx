import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  Filter,
  Play,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { useBIContext } from "../context/BIContext";
import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import "./ReportsPage.css";

const ReportsPage = () => {
  const { usuario, getReports, runReport, exportReport } = useBIContext();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    loadReports();
  }, [usuario.empresaId, filter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports({ empresaId: usuario.empresaId, tipo: filter !== 'todos' ? filter : undefined });
      setReports(data);
    } catch (error) {
      console.error('Error al cargar informes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunReport = async (reportId) => {
    try {
      await runReport(reportId);
      loadReports();
    } catch (error) {
      console.error('Error al ejecutar informe:', error);
    }
  };

  const handleExportReport = async (reportId, format) => {
    try {
      await exportReport(reportId, format);
    } catch (error) {
      console.error('Error al exportar informe:', error);
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle size={18} />;
      case 'pendiente':
        return <Clock size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'completado':
        return 'status-success';
      case 'pendiente':
        return 'status-warning';
      case 'error':
        return 'status-error';
      default:
        return 'status-info';
    }
  };

  const getTypeIcon = (formato) => {
    switch (formato) {
      case 'Excel':
      case 'CSV':
        return <FileSpreadsheet size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  const filteredReports = reports.filter(r => 
    filter === 'todos' || r.tipo === filter
  );

  if (loading) {
    return (
      <div className="reports-page-loading">
        <div className="spinner"></div>
        <p>Cargando informes...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <PageHeader
        title="Informes"
        subtitle="Consulta, ejecuta y exporta informes predefinidos o personalizados"
        actions={null}
      />

      <Card style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <Filter size={18} style={{ color: '#64748b' }} />
          <span style={{ fontWeight: '500', color: '#64748b', marginRight: '0.5rem' }}>Tipo:</span>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'todos' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'todos' ? '#3b82f6' : 'white',
              color: filter === 'todos' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('todos')}
          >
            Todos
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'Ventas' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'Ventas' ? '#3b82f6' : 'white',
              color: filter === 'Ventas' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('Ventas')}
          >
            Ventas
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'Marketing' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'Marketing' ? '#3b82f6' : 'white',
              color: filter === 'Marketing' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('Marketing')}
          >
            Marketing
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'Operaciones' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'Operaciones' ? '#3b82f6' : 'white',
              color: filter === 'Operaciones' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('Operaciones')}
          >
            Operaciones
          </button>
          <button 
            style={{
              padding: '0.5rem 1rem',
              border: filter === 'Finanzas' ? 'none' : '1px solid #e2e8f0',
              borderRadius: '6px',
              background: filter === 'Finanzas' ? '#3b82f6' : 'white',
              color: filter === 'Finanzas' ? 'white' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setFilter('Finanzas')}
          >
            Finanzas
          </button>
        </div>
      </Card>

      <div className="reports-grid">
        {filteredReports.map((report) => (
          <Card key={report.id} className="report-card">
            <div className="report-header">
              <div className="report-icon">
                {getTypeIcon(report.formato)}
              </div>
              <div className="report-info">
                <h3>{report.nombre}</h3>
                <p className="report-description">{report.descripcion}</p>
              </div>
            </div>

            <div className="report-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>Última ejecución: {report.ultimaEjecucion}</span>
              </div>
              <div className={`report-status ${getStatusClass(report.estado)}`}>
                {getStatusIcon(report.estado)}
                <span>{report.estado}</span>
              </div>
            </div>

            <div className="report-tags">
              <span className="tag tag-type">{report.tipo}</span>
              <span className="tag tag-format">{report.formato}</span>
            </div>

            <div className="report-actions">
              <button 
                className="btn-secondary"
                onClick={() => handleRunReport(report.id)}
              >
                <Play size={16} />
                Ejecutar
              </button>
              <button 
                className="btn-primary"
                onClick={() => handleExportReport(report.id, report.formato)}
              >
                <Download size={16} />
                Exportar
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No hay informes disponibles</h3>
          <p>No se encontraron informes para los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
