/**
 * Componente para mostrar lista de documentos
 */

import React from 'react';
import { Download, Trash2, FileText, Calendar, User } from 'lucide-react';
import './DocumentList.css';

const DocumentList = ({ documents, loading, onDownload, onDelete, readOnly = false }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️';
    return '📎';
  };

  if (loading) {
    return <div className="document-list-loading">Cargando documentos...</div>;
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="document-list-empty">
        <FileText size={40} />
        <p>No hay documentos adjuntos</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      <h3 className="document-list-title">Documentos</h3>
      <div className="documents">
        {documents.map((doc) => (
          <div key={doc.id} className="document-item">
            <div className="document-icon">
              <span>{getFileIcon(doc.nombre)}</span>
            </div>

            <div className="document-info">
              <p className="document-name">{doc.nombre}</p>
              <div className="document-meta">
                {doc.usuario_carga && (
                  <span className="meta-item">
                    <User size={12} />
                    {doc.usuario_carga}
                  </span>
                )}
                {doc.fecha_carga && (
                  <span className="meta-item">
                    <Calendar size={12} />
                    {formatDate(doc.fecha_carga)}
                  </span>
                )}
              </div>
            </div>

            <div className="document-actions">
              <button
                className="action-btn download"
                onClick={() => onDownload && onDownload(doc)}
                title="Descargar"
              >
                <Download size={18} />
              </button>
              {!readOnly && (
                <button
                  className="action-btn delete"
                  onClick={() => onDelete && onDelete(doc)}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
