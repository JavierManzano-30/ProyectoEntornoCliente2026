/**
 * Contexto de Soporte - Gestiona la empresa y configuración del usuario
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import soporteService from '../services/soporteService';

const SoporteContext = createContext();

export const useSoporteContext = () => {
  const context = useContext(SoporteContext);
  if (!context) {
    throw new Error('useSoporteContext debe usarse dentro de SoporteProvider');
  }
  return context;
};

export const SoporteProvider = ({ children }) => {
  // Datos del usuario autenticado desde localStorage
  const [usuario] = useState(() => {
    const userId = localStorage.getItem('userId');
    const companyId = localStorage.getItem('companyId');
    const roleId = localStorage.getItem('roleId');
    
    return {
      id: userId || null,
      empresaId: companyId || null,
      rolId: roleId || null,
      rol: 'agente', // Por defecto, se puede obtener del backend
    };
  });

  // Configuración de la empresa
  const [empresaConfig, setEmpresaConfig] = useState({
    tablones: [],
    categorias: [],
    prioridades: [],
    estados: [],
    campos: [],
    notificaciones: {},
    tema: {},
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmpresaConfig();
  }, [usuario.empresaId]);

  const loadEmpresaConfig = async () => {
    try {
      setLoading(true);
      const config = await soporteService.getEmpresaConfig(usuario.empresaId);
      setEmpresaConfig(config);
    } catch (error) {
      console.error('Error al cargar configuración de empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEmpresa = () => {
    // Bloqueado por seguridad: la empresa viene del token JWT.
    return null;
  };

  // Obtener tickets filtrados automáticamente por empresa
  const getTickets = async (filters = {}) => {
    return await soporteService.getTickets({
      ...filters,
      empresaId: usuario.empresaId,
    });
  };

  // Obtener SLAs de la empresa
  const getSLAs = async () => {
    return await soporteService.getSLAs(usuario.empresaId);
  };

  // Obtener reportes de la empresa
  const getReports = async (filters = {}) => {
    return await soporteService.getReports({
      ...filters,
      empresaId: usuario.empresaId,
    });
  };

  const value = {
    usuario,
    empresaConfig,
    loading,
    loadEmpresaConfig,
    cambiarEmpresa,
    getTickets,
    getSLAs,
    getReports,
    // Helpers
    tieneMultiplesTablenes: empresaConfig.tablones.length > 1,
    tablonUnico: empresaConfig.tablones.length === 1 ? empresaConfig.tablones[0] : null,
    coloresTema: empresaConfig.tema,
  };

  return <SoporteContext.Provider value={value}>{children}</SoporteContext.Provider>;
};
