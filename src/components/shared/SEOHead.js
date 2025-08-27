import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getSEOData } from '../../utils/seoData';

const SEOHead = () => {
  const location = useLocation();
  const seoData = getSEOData(location.pathname);

  const baseUrl = 'https://devgenius.vercel.app';
  const fullUrl = `${baseUrl}${location.pathname}`;
  const imageUrl = `${baseUrl}/og-image.png`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={seoData.type === 'tool' ? 'website' : 'website'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="One Toys" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@onetoys" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="One Toys" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Tool-specific structured data */}
      {seoData.type === 'tool' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": seoData.title.split(' - ')[0],
            "description": seoData.description,
            "url": fullUrl,
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "author": {
              "@type": "Organization",
              "name": "One Toys",
              "url": baseUrl
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
