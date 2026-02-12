import React from 'react';
import './PageHeader.css';

const PageHeader = ({ 
  title,
  subtitle,
  actions,
  breadcrumbs,
}) => {
  const isPlainSubtitle = typeof subtitle === 'string' || typeof subtitle === 'number';

  return (
    <div className="page-header">
      {breadcrumbs && (
        <nav className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="breadcrumb-link">
                  {crumb.label}
                </a>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="page-header-content">
        <div className="page-header-text">
          <h1 className="page-title">{title}</h1>
          {subtitle && (
            isPlainSubtitle ? (
              <p className="page-subtitle">{subtitle}</p>
            ) : (
              <div className="page-subtitle">{subtitle}</div>
            )
          )}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
