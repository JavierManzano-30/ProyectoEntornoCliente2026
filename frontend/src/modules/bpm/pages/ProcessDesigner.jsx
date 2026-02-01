/**
 * Página principal - Editor BPMN
 */

import React, { useState } from 'react';
import { useBPMNEditor } from '../hooks/useBPMNEditor';
import BPMNViewer from '../components/designer/BPMNViewer';
import { Save, ZoomIn, ZoomOut, Undo2, Redo2 } from 'lucide-react';
import './ProcessDesigner.css';

const ProcessDesigner = ({ processId }) => {
  const { model, undo, redo, canUndo, canRedo, save, loading } = useBPMNEditor(processId);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoom = (direction) => {
    const newZoom = direction === 'in' ? zoomLevel + 10 : Math.max(50, zoomLevel - 10);
    setZoomLevel(newZoom);
  };

  return (
    <div className="process-designer">
      <div className="designer-toolbar">
        <div className="toolbar-group">
          <h2>Editor de Procesos</h2>
        </div>

        <div className="toolbar-controls">
          <button
            className="tool-btn"
            onClick={() => handleZoom('out')}
            title="Alejar"
          >
            <ZoomOut size={18} />
          </button>
          <span className="zoom-level">{zoomLevel}%</span>
          <button
            className="tool-btn"
            onClick={() => handleZoom('in')}
            title="Acercar"
          >
            <ZoomIn size={18} />
          </button>

          <div className="toolbar-separator" />

          <button
            className="tool-btn"
            onClick={undo}
            disabled={!canUndo}
            title="Deshacer"
          >
            <Undo2 size={18} />
          </button>
          <button
            className="tool-btn"
            onClick={redo}
            disabled={!canRedo}
            title="Rehacer"
          >
            <Redo2 size={18} />
          </button>

          <div className="toolbar-separator" />

          <button
            className="btn-save"
            onClick={save}
            disabled={loading}
          >
            <Save size={18} />
            Guardar
          </button>
        </div>
      </div>

      <div className="designer-workspace">
        <BPMNViewer
          model={model}
          loading={loading}
          zoomLevel={zoomLevel}
        />
      </div>

      <div className="designer-statusbar">
        <span>{model?.nombre || 'Sin guardar'}</span>
        {loading && <span className="saving">Guardando...</span>}
      </div>
    </div>
  );
};

export default ProcessDesigner;
