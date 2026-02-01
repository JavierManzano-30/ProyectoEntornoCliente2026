/**
 * Hook para suscripción a eventos en tiempo real del módulo BPM
 */

import { useEffect, useRef } from 'react';
import { BPM_WS_URL } from '../config/realtime';

export const useBPMRealtime = ({
  enabled = true,
  url = BPM_WS_URL,
  topics = [],
  onMessage,
  onError,
  onOpen,
  onClose
} = {}) => {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!enabled || !url) {
      return undefined;
    }

    let isActive = true;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener('open', () => {
      if (!isActive) return;
      if (topics.length > 0) {
        ws.send(JSON.stringify({ type: 'subscribe', topics }));
      }
      if (onOpen) {
        onOpen();
      }
    });

    ws.addEventListener('message', (event) => {
      if (!isActive) return;
      let payload = event.data;
      try {
        payload = JSON.parse(event.data);
      } catch (err) {
        // Mantener payload como string si no es JSON
      }
      if (onMessage) {
        onMessage(payload);
      }
    });

    ws.addEventListener('error', (event) => {
      if (onError) {
        onError(event);
      }
    });

    ws.addEventListener('close', (event) => {
      if (onClose) {
        onClose(event);
      }
    });

    return () => {
      isActive = false;
      ws.close();
    };
  }, [enabled, url, topics, onMessage, onError, onOpen, onClose]);

  return wsRef;
};
