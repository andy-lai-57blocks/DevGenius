import React from 'react';

const SimpleAd = ({ 
  type = 'mrec', // 'banner' or 'mrec'
  className = '',
  style = {} 
}) => {
  // Get ad configuration
  const adConfig = {
    banner: {
      slot: '8870579772',
      style: { width: '100%', height: '90px' }
    },
    mrec: {
      slot: '1681486325',
      style: { maxWidth: '300px', minHeight: '250px' }
    }
  };

  const config = adConfig[type];
  
  // Show placeholder on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

  if (isLocalhost) {
    return (
      <div 
        className={`ad-container ${type}-ad ${className} ad-placeholder-dev`}
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
        🚫 AdSense ({type.toUpperCase()}) - DEV MODE
      </div>
    );
  }

  return (
    <div className={`ad-container ${type}-ad ${className}`} style={style}>
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
