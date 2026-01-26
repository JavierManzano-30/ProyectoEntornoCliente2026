import React from 'react';
import { X } from 'lucide-react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClass = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${disabled || loading ? 'btn-disabled' : ''} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={18} className="btn-icon-left" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={18} className="btn-icon-right" />}
        </>
      )}
    </button>
  );
};

export default Button;
