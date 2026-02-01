/**
 * Componente BPMNViewer - Visualizador de diagramas BPMN
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import './BPMNViewer.css';

const BPMNViewer = ({ model, loading, error }) => {
  if (loading) {
    return <div className="bpmn-viewer loading">Cargando diagrama...</div>;
  }

  if (error) {
    return (
      <div className="bpmn-viewer error">
        <AlertCircle size={32} />
        <p>{error}</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="bpmn-viewer empty">
        <p>No hay modelo BPMN para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bpmn-viewer">
      <div className="bpmn-container">
        <div id="bpmn-canvas" className="bpmn-canvas">
          {/* Aquí iría la integración con bpmn-js */}
          <div className="canvas-placeholder">
            <p>Diagrama: {model.nombre}</p>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              {model.elementos?.length || 0} elementos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPMNViewer;
