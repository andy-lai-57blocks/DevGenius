import React from 'react';

const SimpleAd = ({ 
  className = '',
  style = {} 
}) => {
  // Mrec ad configuration
  const config = {
    slot: '1681486325',
    style: { maxWidth: '300px', minHeight: '250px' }
  };
  
  // Show placeholder on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    return (
      <div 
        className={`ad-container mrec-ad ${className} ad-placeholder-dev`}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          color: '#666',
          fontSize: '14px',
          fontFamily: 'monospace',
          ...config.style
        }}
      >
        🚫 AdSense (MREC) - DEV MODE
      </div>
    );
  }

  return (
    <div className={`ad-container mrec-ad ${className}`} style={style}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', ...config.style }}
        data-ad-client="ca-pub-8806399994474387"
        data-ad-slot={config.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default SimpleAd;
