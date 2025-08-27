import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getBreadcrumbs } from '../../utils/seoData';

const Breadcrumbs = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="breadcrumb-item">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link 
                  to={crumb.path} 
                  className="breadcrumb-link"
                  aria-label={`Go to ${crumb.label}`}
                >
                  {crumb.label}
                </Link>
                <span className="breadcrumb-separator" aria-hidden="true">›</span>
              </>
            ) : (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
