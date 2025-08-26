import React from 'react';
import { Link } from 'react-router-dom';

const EncodersDecoders = () => {
  const tools = [
    {
      path: '/encoders/base64',
      title: 'Base64 Encoder/Decoder',
      description: 'Encode and decode text using Base64 encoding scheme',
      icon: '🔐'
    },
    {
      path: '/encoders/url',
      title: 'URL Encoder/Decoder',
      description: 'Encode and decode URLs for safe transmission over the internet',
      icon: '🌐'
    },
    {
      path: '/encoders/html',
      title: 'HTML Encoder/Decoder',
      description: 'Encode and decode HTML entities and special characters',
      icon: '📝'
    }
  ];

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>🔐 Encoders / Decoders</h1>
        <p>Essential functions for encoding and decoding various data formats</p>
      </div>
      
      <div className="tool-group">
        <h2 className="group-title">Encoding Functions</h2>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <Link 
              key={tool.path} 
              to={tool.path} 
              className="tool-card category-card"
              style={{ '--card-index': index }}
            >
              <div className="card-header">
                <div className="category-icon">{tool.icon}</div>
                <div className="category-arrow">→</div>
              </div>
              <div className="card-content">
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EncodersDecoders;
