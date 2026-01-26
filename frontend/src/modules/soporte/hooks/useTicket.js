import { useState, useEffect, useCallback } from 'react';
import soporteService from '../services/soporteService';

export const useTicket = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchTicket = useCallback(async () => {
    if (!ticketId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await soporteService.getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el ticket');
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const updateTicket = useCallback(async (updates) => {
    try {
      setUpdating(true);
      const updatedTicket = await soporteService.updateTicket(ticketId, updates);
      setTicket(updatedTicket);
      return { success: true, data: updatedTicket };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el ticket';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  }, [ticketId]);

  const changeStatus = useCallback(async (newStatus) => {
    try {
      setUpdating(true);
      const updatedTicket = await soporteService.changeTicketStatus(ticketId, newStatus);
      setTicket(updatedTicket);
      return { success: true, data: updatedTicket };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cambiar el estado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  }, [ticketId]);

  const assignTicket = useCallback(async (usuarioId) => {
    try {
      setUpdating(true);
      const updatedTicket = await soporteService.assignTicket(ticketId, usuarioId);
      setTicket(updatedTicket);
      return { success: true, data: updatedTicket };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al asignar el ticket';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  }, [ticketId]);

  const escalateTicket = useCallback(async (motivo) => {
    try {
      setUpdating(true);
      const result = await soporteService.escalateTicket(ticketId, motivo);
      await fetchTicket(); // Recargar el ticket completo
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al escalar el ticket';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  }, [ticketId, fetchTicket]);

  const refetch = useCallback(() => {
    fetchTicket();
  }, [fetchTicket]);

  return {
    ticket,
    loading,
    error,
    updating,
    updateTicket,
    changeStatus,
    assignTicket,
    escalateTicket,
    refetch,
  };
};
