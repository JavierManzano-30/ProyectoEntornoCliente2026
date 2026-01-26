import React from 'react';
import { User } from 'lucide-react';
import { formatDistanceToNow } from '../../../utils/dateHelpers';
import './MessageItem.css';

const MessageItem = ({ message }) => {
  const isInternal = message.tipo === 'interno';
  const isSystem = message.tipo === 'sistema';

  return (
    <div className={`message-item ${isInternal ? 'message-internal' : ''} ${isSystem ? 'message-system' : ''}`}>
      <div className="message-avatar">
        <User size={20} />
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-author">{message.autor?.nombre || 'Sistema'}</span>
          <span className="message-time">
            {message.fechaCreacion ? formatDistanceToNow(message.fechaCreacion) : 'Ahora'}
          </span>
          {isInternal && <span className="message-badge">Interno</span>}
        </div>
        <div className="message-body">
          {message.contenido}
        </div>
        {message.adjuntos && message.adjuntos.length > 0 && (
          <div className="message-attachments">
            {message.adjuntos.map((attachment, index) => (
              <a 
                key={index}
                href={attachment.url}
                className="message-attachment"
                target="_blank"
                rel="noopener noreferrer"
              >
                📎 {attachment.nombre}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
