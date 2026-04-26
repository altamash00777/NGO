import React from 'react';
import './Button.css';

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseClass = `btn btn-${variant} hover-lift ${className}`;
  return (
    <button className={baseClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
