import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const FluidAd = ({ 
  className = '',
  style = {},
  adSlot = '4012628436',
  adClient = 'ca-pub-8806399994474387'
}) => {
  const adRef = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const mountedRef = useRef(true);

  // Configuration for fluid ad
  const config = {
    slot: adSlot,
    client: adClient,
    format: 'fluid',
    layoutKey: '-6t+ed+2i-1n-4w'
  };

  // Check if we're on localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Unique key per route for DOM freshness
  const adKey = `fluid-${config.slot}-${location.pathname.replace(/\//g, '-')}`;

  // SPA-optimized ad initialization (uses static script from index.html)
  useEffect(() => {
    if (!mountedRef.current || isLocalhost || !isMobile) {
      setIsLoading(false);
      return;
    }

    const initializeAd = () => {
      // Wait for AdSense script to be ready
      const checkAdSenseReady = () => {
        if (window.adsbygoogle && adRef.current) {
          const insElement = adRef.current.querySelector('ins.adsbygoogle');
          
          if (insElement && !insElement.hasAttribute('data-adsbygoogle-status')) {
            try {
              console.log(`🔄 SPA: Initializing fluid ad for ${location.pathname}`);
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              
              if (mountedRef.current) {
                setIsLoading(false);
              }
            } catch (error) {
              // Handle "already have ads" error gracefully
              if (error.message?.includes('already have ads')) {
                console.log('⚠️ SPA: Fluid ad slot already filled, this is expected behavior');
              } else {
                console.warn('⚠️ SPA: Fluid ad initialization warning:', error.message);
              }
              
              if (mountedRef.current) {
                setIsLoading(false);
              }
            }
          } else {
            if (mountedRef.current) {
              setIsLoading(false);
            }
          }
        } else {
          // AdSense not ready yet, wait a bit more
          setTimeout(checkAdSenseReady, 100);
        }
      };

      // Small delay for DOM settlement
      setTimeout(checkAdSenseReady, 50);
    };

    setIsLoading(true);
    initializeAd();

    // Cleanup
    return () => {
      mountedRef.current = false;
    };
  }, [location.pathname, isLocalhost, isMobile]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  // Development mode placeholder
  if (isLocalhost) {
    return (
      <div 
        className={`mobile-ad-container fluid-ad ${className} ad-placeholder-dev`}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          color: '#64748b',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minHeight: '100px',
          margin: '16px 0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>📱 Mobile Fluid Ad</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            DEV MODE - {location.pathname}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mobile-ad-container fluid-ad ${className}`} 
      style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '12px',
        padding: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        ...style 
      }} 
      ref={adRef}
    >
      <ins 
        key={adKey} // Forces fresh DOM element per route
        className="adsbygoogle"
        style={{ 
          display: 'block',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        data-ad-format={config.format}
        data-ad-layout-key={config.layoutKey}
        data-ad-client={config.client}
        data-ad-slot={config.slot}
      />
      
      {/* Stylish loading indicator */}
      {isLoading && (
        <>
          <div 
            className="ad-loading-indicator"
            style={{ 
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '16px',
              height: '16px',
              border: '2px solid #e2e8f0',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'mobile-ad-spin 1s linear infinite',
              opacity: 0.8
            }}
          />
          <style>{`
            @keyframes mobile-ad-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default FluidAd;
