/**
 * Componente selector de usuarios
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Users } from 'lucide-react';
import './UserPicker.css';

const UserPicker = ({ 
  value = null, 
  onChange, 
  users = [], 
  placeholder = 'Seleccionar usuario...',
  multiple = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(multiple ? (value || []) : (value ? [value] : []));
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(user =>
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user) => {
    if (multiple) {
      const isSelected = selectedUsers.some(u => u.id === user.id);
      const newSelection = isSelected
        ? selectedUsers.filter(u => u.id !== user.id)
        : [...selectedUsers, user];
      
      setSelectedUsers(newSelection);
      onChange(newSelection);
    } else {
      setSelectedUsers([user]);
      onChange(user);
      setIsOpen(false);
    }
  };

  const handleRemoveUser = (userId) => {
    const newSelection = selectedUsers.filter(u => u.id !== userId);
    setSelectedUsers(newSelection);
    onChange(multiple ? newSelection : null);
  };

  const isUserSelected = (userId) => {
    return selectedUsers.some(u => u.id === userId);
  };

  return (
    <div className="user-picker" ref={containerRef}>
      <div 
        className={`user-picker-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedUsers.length > 0 ? (
          <div className="user-picker-selected">
            {selectedUsers.map(user => (
              <div key={user.id} className="user-picker-chip">
                <User size={14} />
                <span>{user.nombre}</span>
                {!disabled && (
                  <button
                    type="button"
                    className="user-picker-chip-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUser(user.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="user-picker-placeholder">{placeholder}</span>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="user-picker-dropdown">
          <div className="user-picker-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="user-picker-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-picker-item ${isUserSelected(user.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="user-picker-item-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.nombre} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className="user-picker-item-info">
                    <div className="user-picker-item-name">{user.nombre}</div>
                    {user.email && (
                      <div className="user-picker-item-email">{user.email}</div>
                    )}
                    {user.rol && (
                      <div className="user-picker-item-role">{user.rol}</div>
                    )}
                  </div>
                  {isUserSelected(user.id) && (
                    <div className="user-picker-item-check">✓</div>
                  )}
                </div>
              ))
            ) : (
              <div className="user-picker-empty">
                <Users size={32} />
                <p>No se encontraron usuarios</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPicker;
