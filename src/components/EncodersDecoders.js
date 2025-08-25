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
    <div className="tool-container">
      <div className="tool-header">
        <h2>Encoders / Decoders</h2>
        <p>Tools for encoding and decoding various data formats</p>
      </div>
      
      <div className="category-tools-grid">
        {tools.map((tool) => (
          <Link key={tool.path} to={tool.path} className="category-tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <div className="tool-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EncodersDecoders;
