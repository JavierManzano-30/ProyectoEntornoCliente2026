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
    return {
      id: user?.id || null,
      nombre: 'Usuario',
      email: '',
      rol: 'analista',
      empresaId: user?.companyId || null,
      empresaNombre: 'EMPRESA DEMO',
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

  // Cambiar empresa (deshabilitado en producción)
  const cambiarEmpresa = (empresaId) => {
    console.log('Cambio de empresa deshabilitado en modo producción');
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

  // Obtener datasets
  const getDatasets = async () => {
    return await biService.getDatasets();
  };

  // Obtener alertas
  const getAlerts = async () => {
    return await biService.getAlerts();
  };

  const value = {
    usuario,
    loading,
    cambiarEmpresa,
    getKPIs,
    getDashboardData,
    getReports,
    getDatasets,
    getAlerts,
  };

  return <BIContext.Provider value={value}>{children}</BIContext.Provider>;
};
