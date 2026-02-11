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
  // Usuario y empresa actual (en producción vendría del contexto de auth)
  const [usuario, setUsuario] = useState({
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@techcorp.com',
    rol: 'analista',
    empresaId: 1,
    empresaNombre: 'TechCorp Solutions',
  });

  const [loading, setLoading] = useState(false);

  // Cambiar empresa (solo para demo)
  const cambiarEmpresa = (empresaId) => {
    const empresas = {
      1: { nombre: 'TechCorp Solutions' },
      2: { nombre: 'InnovaDigital S.A.' },
      3: { nombre: 'GlobalServices Ltd' },
    };
    const empresa = empresas[empresaId];
    if (empresa) {
      setUsuario({
        ...usuario,
        empresaId,
        empresaNombre: empresa.nombre,
      });
    }
  };

  // Obtener KPIs filtrados por empresa
  const getKPIs = async (filters = {}) => {
    return await biService.getKPIs({
      ...filters,
      empresaId: usuario.empresaId,
    });
  };

  // Obtener datos del dashboard filtrados por empresa
  const getDashboardData = async (filters = {}) => {
    return await biService.getDashboardData({
      ...filters,
      empresaId: usuario.empresaId,
    });
  };

  // Obtener reportes
  const getReports = async (filters = {}) => {
    return await biService.getReports({
      ...filters,
      empresaId: usuario.empresaId,
    });
  };

  // Obtener datasets
  const getDatasets = async () => {
    return await biService.getDatasets(usuario.empresaId);
  };

  // Obtener alertas
  const getAlerts = async () => {
    return await biService.getAlerts(usuario.empresaId);
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
