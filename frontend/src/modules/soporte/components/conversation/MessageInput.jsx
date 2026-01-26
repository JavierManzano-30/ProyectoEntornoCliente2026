import React, { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import Button from '../../../../components/common/Button';
import './MessageInput.css';

const MessageInput = ({ onSend, onUpload, sending }) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isInternal, setIsInternal] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && !attachedFile) return;

    const messageData = {
      contenido: message.trim(),
      tipo: isInternal ? 'interno' : 'publico',
    };

    const success = await onSend(messageData);
    
    if (success) {
      setMessage('');
      setAttachedFile(null);
      setIsInternal(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-container">
      {attachedFile && (
        <div className="attached-file">
          <span className="attached-file-name">📎 {attachedFile.name}</span>
          <button 
            type="button" 
            className="attached-file-remove"
            onClick={handleRemoveFile}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="message-input-main">
        <textarea
          className="message-textarea"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={3}
          disabled={sending}
        />

        <div className="message-input-actions">
          <div className="message-input-options">
            <label className="internal-checkbox">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                disabled={sending}
              />
              <span>Mensaje interno</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              className="file-input-hidden"
              onChange={handleFileSelect}
              disabled={sending}
            />
            <Button
              type="button"
              variant="ghost"
              size="small"
              icon={Paperclip}
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
            >
              Adjuntar
            </Button>
          </div>

          <Button
            type="submit"
            variant="primary"
            icon={Send}
            disabled={(!message.trim() && !attachedFile) || sending}
            loading={sending}
          >
            Enviar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
