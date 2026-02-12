/**
 * Contexto de BI - Gestiona la empresa y datos de Business Intelligence
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import biService from '../services/biService';

const BIContext = createContext();

export const useBIContext = () => {
  const context = useContext(BIContext);
  if (!context) {
    throw new Error('useBIContext debe usarse dentro de BIProvider');
  }
  return context;
};

export const BIProvider = ({ children }) => {
  const readStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      return {};
    }
  };

  // Obtener datos de autenticación desde localStorage
  const getUserFromStorage = () => {
    const userId = localStorage.getItem('userId');
    const companyId = localStorage.getItem('companyId');
    const token = localStorage.getItem('token');
    
    if (!token || !userId || !companyId) {
      return null;
    }
    
    return {
      id: userId,
      companyId: companyId
    };
  };

  const [usuario, setUsuario] = useState(() => {
    const user = getUserFromStorage();
    const storedUser = readStoredUser();
    const userName = storedUser?.nombre || storedUser?.name || storedUser?.email || '';
    const userRole = storedUser?.rol || storedUser?.role || '';
    const companyName = localStorage.getItem('companyName') || '';

    return {
      id: user?.id || null,
      nombre: userName,
      email: storedUser?.email || '',
      rol: userRole,
      empresaId: user?.companyId || null,
      empresaNombre: companyName || '',
    };
  });

  const [loading, setLoading] = useState(false);

  // Actualizar usuario cuando cambia localStorage
  useEffect(() => {
    const user = getUserFromStorage();
    if (user) {
      setUsuario(prev => ({
        ...prev,
        id: user.id,
        empresaId: user.companyId,
      }));
    }
  }, []);

  // Cambio de empresa controlado por la sesión del usuario en backend.
  const cambiarEmpresa = (empresaId) => {
    console.warn('Cambio de empresa no soportado desde frontend', empresaId);
  };

  // Obtener KPIs (companyId viene del token JWT en backend)
  const getKPIs = async (filters = {}) => {
    return await biService.getKPIs(filters);
  };

  // Obtener datos del dashboard
  const getDashboardData = async (filters = {}) => {
    return await biService.getDashboardData(filters);
  };

  // Obtener reportes
  const getReports = async (filters = {}) => {
    return await biService.getReports(filters);
  };

  const runReport = async (reportId) => {
    return await biService.runReport(reportId);
  };

  const exportReport = async (reportId, format) => {
    return await biService.exportReport(reportId, format);
  };

  // Obtener datasets
  const getDatasets = async () => {
    return await biService.getDatasets();
  };

  const syncDataset = async (datasetId) => {
    return await biService.syncDataset(datasetId);
  };

  // Obtener alertas
  const getAlerts = async () => {
    return await biService.getAlerts();
  };

  // Marcar alerta como leída (persistencia local)
  const markAlertAsRead = async (alertId) => {
    return await biService.markAlertAsRead(alertId);
  };

  const value = {
    usuario,
    loading,
    cambiarEmpresa,
    getKPIs,
    getDashboardData,
    getReports,
    runReport,
    exportReport,
    getDatasets,
    syncDataset,
    getAlerts,
    markAlertAsRead,
  };

  return <BIContext.Provider value={value}>{children}</BIContext.Provider>;
};
