/**
 * Componente de hilo de comentarios
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MoreVertical, Trash2 } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';
import './CommentThread.css';

const CommentThread = ({ 
  comments = [], 
  onAddComment, 
  onDeleteComment,
  currentUserId,
  loading = false,
  placeholder = 'Escribir comentario...'
}) => {
  const [newComment, setNewComment] = useState('');
  const [showMenuId, setShowMenuId] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [newComment]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddComment();
    }
  };

  const isCommentOwner = (commentUserId) => {
    return commentUserId === currentUserId;
  };

  return (
    <div className="comment-thread">
      <div className="comment-thread-list">
        {comments.length === 0 ? (
          <div className="comment-thread-empty">
            <p>No hay comentarios aún</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                {comment.usuario?.avatar ? (
                  <img src={comment.usuario.avatar} alt={comment.usuario.nombre} />
                ) : (
                  <User size={20} />
                )}
              </div>

              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">
                    {comment.usuario?.nombre || 'Usuario Anónimo'}
                  </span>
                  <span className="comment-date">
                    {formatDateTime(comment.fecha_creacion || comment.createdAt)}
                  </span>
                </div>

                <p className="comment-text">{comment.texto || comment.comentario}</p>

                {comment.usuario?.rol && (
                  <span className="comment-role">{comment.usuario.rol}</span>
                )}
              </div>

              <div className="comment-menu">
                <button
                  type="button"
                  className="comment-menu-trigger"
                  onClick={() => setShowMenuId(showMenuId === comment.id ? null : comment.id)}
                >
                  <MoreVertical size={16} />
                </button>

                {showMenuId === comment.id && isCommentOwner(comment.usuario_id) && (
                  <div className="comment-menu-dropdown">
                    <button
                      type="button"
                      className="comment-menu-item comment-menu-delete"
                      onClick={() => {
                        onDeleteComment(comment.id);
                        setShowMenuId(null);
                      }}
                    >
                      <Trash2 size={16} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="comment-thread-input">
        <div className="comment-input-wrapper">
          <textarea
            ref={textareaRef}
            className="comment-input"
            placeholder={placeholder}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
          />
          <button
            type="button"
            className={`comment-submit ${newComment.trim() === '' ? 'disabled' : ''}`}
            onClick={handleAddComment}
            disabled={loading || newComment.trim() === ''}
            title="Enviar comentario (Ctrl+Enter)"
          >
            <Send size={18} />
          </button>
        </div>
        <span className="comment-hint">Presiona Ctrl+Enter para enviar</span>
      </div>
    </div>
  );
};

export default CommentThread;
