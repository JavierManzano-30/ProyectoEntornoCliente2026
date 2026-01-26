import React from 'react';
import { useConversation } from '../../hooks/useConversation';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import './ConversationThread.css';

const ConversationThread = ({ ticketId }) => {
  const { messages, loading, error, sending, sendMessage, uploadAttachment, refetch } = 
    useConversation(ticketId);

  const handleSendMessage = async (messageData) => {
    const result = await sendMessage(messageData);
    if (result.success) {
      return true;
    }
    return false;
  };

  const handleUploadFile = async (file) => {
    const result = await uploadAttachment(file);
    return result.success;
  };

  if (loading) return <LoadingSpinner text="Cargando conversación..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="conversation-thread">
      <div className="conversation-messages">
        {messages.length === 0 ? (
          <div className="conversation-empty">
            <p>No hay mensajes en esta conversación</p>
            <p className="conversation-empty-hint">Sé el primero en responder</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
      </div>

      <MessageInput 
        onSend={handleSendMessage}
        onUpload={handleUploadFile}
        sending={sending}
      />
    </div>
  );
};

export default ConversationThread;
