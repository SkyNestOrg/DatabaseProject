import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const PageErrorBoundary = ({ children, pageName }) => {
  return (
    <ErrorBoundary
      fallback={(resetError) => (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h2>Error in {pageName}</h2>
            <p>Something went wrong while loading the {pageName.toLowerCase()} page.</p>
            <div className="error-actions">
              <button onClick={resetError} className="retry-button">
                🔄 Retry {pageName}
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="back-button"
              >
                🏠 Go to Dashboard
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="reload-button"
              >
                🔃 Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;