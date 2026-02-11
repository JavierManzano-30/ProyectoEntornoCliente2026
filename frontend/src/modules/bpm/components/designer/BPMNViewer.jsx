/**
 * Componente BPMNViewer - Visualizador de diagramas BPMN
 */

import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import { AlertCircle } from 'lucide-react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import './BPMNViewer.css';

const BPMNViewer = ({ model, loading, error, zoomLevel = 100 }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [renderError, setRenderError] = useState(null);

  const xml = model?.xml || model?.bpmnXml || model?.definitionXml || model?.diagramXml;

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    viewerRef.current = new BpmnViewer({
      container: containerRef.current
    });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!viewerRef.current || !xml) {
        return;
      }

      try {
        setRenderError(null);
        await viewerRef.current.importXML(xml);
        const canvas = viewerRef.current.get('canvas');
        if (zoomLevel) {
          canvas.zoom(zoomLevel / 100);
        } else {
          canvas.zoom('fit-viewport');
        }
      } catch (err) {
        setRenderError('No se pudo cargar el diagrama BPMN.');
      }
    };

    renderDiagram();
  }, [xml, zoomLevel]);

  useEffect(() => {
    if (!viewerRef.current || !xml) {
      return;
    }

    const canvas = viewerRef.current.get('canvas');
    canvas.zoom(zoomLevel / 100);
  }, [zoomLevel, xml]);

  if (loading) {
    return <div className="bpmn-viewer loading">Cargando diagrama...</div>;
  }

  if (error || renderError) {
    return (
      <div className="bpmn-viewer error">
        <AlertCircle size={32} />
        <p>{error || renderError}</p>
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
        {xml ? (
          <div ref={containerRef} className="bpmn-canvas" />
        ) : (
          <div className="bpmn-canvas">
            <div className="canvas-placeholder">
              <p>Diagrama: {model.nombre}</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                {model.elementos?.length || 0} elementos
              </p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                No hay XML BPMN disponible para renderizar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BPMNViewer;
