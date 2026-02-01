/**
 * Hook para manejar documentos de instancias
 */

import { useState, useEffect, useCallback } from 'react';
import { bpmService } from '../services/bpmService';

export const useDocuments = (instanceId) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!instanceId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await bpmService.getInstanceDocuments(instanceId);
      setDocuments(data.data || data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar documentos:', err);
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (file, metadata = {}) => {
    if (!instanceId) return;
    
    setUploading(true);
    try {
      const newDoc = await bpmService.uploadDocument(instanceId, file, metadata);
      setDocuments(prev => [...prev, newDoc.data || newDoc]);
      return newDoc.data || newDoc;
    } catch (err) {
      console.error('Error al subir documento:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (documentId) => {
    try {
      const blob = await bpmService.downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documents.find(d => d.id === documentId)?.nombre || 'documento';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error al descargar documento:', err);
      throw err;
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await bpmService.deleteDocument(documentId);
      setDocuments(prev => prev.filter(d => d.id !== documentId));
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    uploading,
    fetchDocuments,
    uploadDocument,
    downloadDocument,
    deleteDocument
  };
};
