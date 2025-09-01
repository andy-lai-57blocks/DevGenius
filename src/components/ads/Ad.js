import React, { useEffect, useRef, useState } from 'react';
import { useAds } from '../../contexts/AdContext';

const Ad = ({ 
  type = 'mrec', // 'banner' or 'mrec'
  className = '',
  style = {},
  lazy = true 
}) => {
  const { adsenseLoaded, loadedAds, initializeAd, AD_UNITS, AD_CLIENT, IS_DEVELOPMENT } = useAds();
  const adRef = useRef(null);
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [adId] = useState(() => `${type}-ad-${Math.random().toString(36).substr(2, 9)}`);

  const adUnit = AD_UNITS[type];
  const isAdLoaded = loadedAds.has(adId);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (IS_DEVELOPMENT || !lazy || isVisible) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observerRef.current.observe(adRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [lazy, isVisible]);

  // Initialize ad when visible and AdSense is loaded
  useEffect(() => {
    if (IS_DEVELOPMENT || !isVisible || !adsenseLoaded || isAdLoaded) return;

    const element = adRef.current?.querySelector('.adsbygoogle');
    if (element) {
      initializeAd(adId, element);
    }
  }, [isVisible, adsenseLoaded, isAdLoaded, adId, initializeAd]);

  // Show placeholder in development
  if (IS_DEVELOPMENT) {
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
          ...(type === 'banner' && { height: '90px' }),
          ...(type === 'mrec' && { height: '250px', maxWidth: '300px', margin: '1rem auto 0' })
        }}
      >
        🚫 AdSense ({type.toUpperCase()}) - DEV MODE
      </div>
    );
  }

  const containerClass = `ad-container ${type}-ad ${className}`;
  const containerStyle = {
    ...style,
    display: isAdLoaded ? (type === 'banner' ? 'flex' : 'block') : 'none'
  };

  return (
    <div 
      ref={adRef}
      className={containerClass}
      style={containerStyle}
      id={adId}
    >
      <ins 
        className="adsbygoogle"
        style={{
          display: 'block',
          ...adUnit.style
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adUnit.slot}
        {...(adUnit.format && { 'data-ad-format': adUnit.format })}
        {...(adUnit.responsive && { 'data-full-width-responsive': 'true' })}
      />
    </div>
  );
};

export default Ad;
