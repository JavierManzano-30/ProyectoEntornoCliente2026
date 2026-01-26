import React from 'react';
import './Badge.css';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = '',
  ...props 
}) => {
  const badgeClass = `badge badge-${variant} badge-${size} ${className}`;

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;
