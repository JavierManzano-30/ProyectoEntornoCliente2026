import React, { useState, useEffect } from "react";
import { 
  Database,
  RefreshCw,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  Building2,
  Eye
} from "lucide-react";
import { useBIContext } from "../context/BIContext";
import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import "./DatasetsPage.css";

const DatasetsPage = () => {
  const { usuario, cambiarEmpresa, getDatasets, syncDataset } = useBIContext();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState({});

  useEffect(() => {
    loadDatasets();
  }, [usuario.empresaId]);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const data = await getDatasets(usuario.empresaId);
      setDatasets(data);
    } catch (error) {
      console.error('Error al cargar datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (datasetId) => {
    setSyncing(prev => ({ ...prev, [datasetId]: true }));
    try {
      await syncDataset(datasetId);
      await loadDatasets();
    } catch (error) {
      console.error('Error al sincronizar dataset:', error);
    } finally {
      setSyncing(prev => ({ ...prev, [datasetId]: false }));
    }
  };

  const getStatusIcon = (estado) => {
    return estado === 'Activo' ? <CheckCircle size={18} /> : <AlertCircle size={18} />;
  };

  const getStatusClass = (estado) => {
    return estado === 'Activo' ? 'status-active' : 'status-inactive';
  };

  const getSourceColor = (fuente) => {
    const colors = {
      'ERP': '#3b82f6',
      'CRM': '#10b981',
      'Proyectos': '#8b5cf6',
      'RRHH': '#f59e0b',
      'Soporte': '#ec4899'
    };
    return colors[fuente] || '#64748b';
  };

  if (loading) {
    return (
      <div className="datasets-page-loading">
        <div className="spinner"></div>
        <p>Cargando datasets...</p>
      </div>
    );
  }

  return (
    <div className="datasets-page">
      <PageHeader
        title="Datasets"
        subtitle="Gestiona las fuentes de datos, refrescos y calidad de los datasets utilizados en BI"
        actions={
          <>
            <div className="empresa-selector-demo">
              <Building2 size={18} />
              <select 
                value={usuario.empresaId} 
                onChange={(e) => cambiarEmpresa(parseInt(e.target.value))}
                className="empresa-select"
              >
                <option value={1}>TechCorp Solutions</option>
                <option value={2}>InnovaDigital S.A.</option>
                <option value={3}>GlobalServices Ltd</option>
              </select>
            </div>
          </>
        }
      />

      <div className="datasets-grid">
        {datasets.map((dataset) => (
          <Card key={dataset.id} className="dataset-card">
            <div className="dataset-header">
              <div className="dataset-icon" style={{ background: getSourceColor(dataset.fuente) }}>
                <Database size={24} />
              </div>
              <div className="dataset-info">
                <h3>{dataset.nombre}</h3>
                <p className="dataset-source">{dataset.fuente}</p>
              </div>
              <div className={`dataset-status ${getStatusClass(dataset.estado)}`}>
                {getStatusIcon(dataset.estado)}
                <span>{dataset.estado}</span>
              </div>
            </div>

            <div className="dataset-metrics">
              <div className="metric">
                <Calendar size={16} />
                <span className="metric-label">Última actualización</span>
                <span className="metric-value">{dataset.ultimaActualizacion}</span>
              </div>
              <div className="metric">
                <RefreshCw size={16} />
                <span className="metric-label">Frecuencia</span>
                <span className="metric-value">{dataset.refresco}</span>
              </div>
              <div className="metric">
                <Activity size={16} />
                <span className="metric-label">Registros</span>
                <span className="metric-value">{dataset.registros?.toLocaleString('es-ES')}</span>
              </div>
            </div>

            <div className="dataset-actions">
              <button className="btn-secondary">
                <Eye size={16} />
                Ver detalle
              </button>
              <button 
                className="btn-primary"
                onClick={() => handleSync(dataset.id)}
                disabled={syncing[dataset.id]}
              >
                <RefreshCw size={16} className={syncing[dataset.id] ? 'spinning' : ''} />
                {syncing[dataset.id] ? 'Sincronizando...' : 'Sincronizar'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {datasets.length === 0 && (
        <div className="empty-state">
          <Database size={48} />
          <h3>No hay datasets disponibles</h3>
          <p>No se encontraron datasets para esta empresa</p>
        </div>
      )}
    </div>
  );
};

export default DatasetsPage;
