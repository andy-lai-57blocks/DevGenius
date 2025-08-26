import React, { useEffect } from 'react';

const GoogleAd = ({ 
  adClient = process.env.REACT_APP_GOOGLE_ADSENSE_CLIENT || "ca-pub-8806399994474387",
  adSlot = process.env.REACT_APP_GOOGLE_ADSENSE_SLOT,
  adFormat = "rectangle",
  width = 300,
  height = 250,
  responsive = false,
  className = ""
}) => {
  useEffect(() => {
    try {
      // Only load ads if we're in production or have valid ad credentials
      if (adClient && adClient !== "ca-pub-xxxxxxxxxx" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('Google AdSense error:', err);
    }
  }, [adClient]);

  // Show placeholder in development or when ad slot is not set
  const isProduction = process.env.NODE_ENV === 'production';
  const hasValidCredentials = adClient && adClient.startsWith("ca-pub-") && 
                               adSlot && adSlot !== "xxxxxxxxxx";

  if (!isProduction || !hasValidCredentials) {
    return (
      <div className={`ad-container ${className}`}>
        <div className="ad-placeholder" style={{ width: `${width}px`, height: `${height}px` }}>
          <span>Advertisement</span>
          <div className="ad-size">{width} × {height}</div>
          {!hasValidCredentials && (
            <div className="ad-setup-note">
              {adSlot === "xxxxxxxxxx" ? 
                "Create ad units in AdSense and set REACT_APP_GOOGLE_ADSENSE_SLOT" : 
                "Set REACT_APP_GOOGLE_ADSENSE_CLIENT and REACT_APP_GOOGLE_ADSENSE_SLOT"
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: responsive ? 'auto' : `${width}px`,
          height: responsive ? 'auto' : `${height}px`
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  );
};

export default GoogleAd;
