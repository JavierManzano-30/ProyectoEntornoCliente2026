import React from 'react';
import './Badge.css';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = '',
  color,
  bgColor,
  style,
  ...props 
}) => {
  const badgeClass = `badge badge-${variant} badge-${size} ${className}`;
  const mergedStyle = {
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...(color ? { color } : {}),
    ...(style || {})
  };

  return (
    <span className={badgeClass} style={mergedStyle} {...props}>
      {children}
    </span>
  );
};

export default Badge;
