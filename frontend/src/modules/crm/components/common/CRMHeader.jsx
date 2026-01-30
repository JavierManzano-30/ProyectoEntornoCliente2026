import React from 'react';
import './CRMHeader.css';

const CRMHeader = ({ title, subtitle, actions, icon: Icon }) => {
  return (
    <div className="crm-header">
      <div className="crm-header__content">
        {Icon && (
          <div className="crm-header__icon">
            <Icon size={32} />
          </div>
        )}
        <div className="crm-header__text">
          <h1 className="crm-header__title">{title}</h1>
          {subtitle && <p className="crm-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="crm-header__actions">{actions}</div>}
    </div>
  );
};

export default CRMHeader;
