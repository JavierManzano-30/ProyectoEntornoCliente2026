import { useState, useEffect, useCallback } from 'react';
import soporteService from '../services/soporteService';

export const useConversation = (ticketId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchConversation = useCallback(async () => {
    if (!ticketId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await soporteService.getConversation(ticketId);
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar la conversación');
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const sendMessage = useCallback(async (messageData) => {
    try {
      setSending(true);
      const newMessage = await soporteService.addMessage(ticketId, messageData);
      setMessages((prev) => [...prev, newMessage]);
      return { success: true, data: newMessage };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al enviar el mensaje';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSending(false);
    }
  }, [ticketId]);

  const uploadAttachment = useCallback(async (file, messageId = null) => {
    try {
      const attachment = await soporteService.uploadAttachment(ticketId, file, messageId);
      return { success: true, data: attachment };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al subir el archivo';
      return { success: false, error: errorMessage };
    }
  }, [ticketId]);

  const refetch = useCallback(() => {
    fetchConversation();
  }, [fetchConversation]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    uploadAttachment,
    refetch,
  };
};
