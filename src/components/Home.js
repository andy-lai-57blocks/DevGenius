import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    {
      path: '/encoders',
      title: 'Encoders / Decoders',
      description: 'Base64, URL, HTML encoding and decoding tools',
      icon: '🔐',
      toolCount: 3
    },
    {
      path: '/formatters',
      title: 'Formatters',
      description: 'JSON and XML formatting and validation tools',
      icon: '📋',
      toolCount: 2
    },
    {
      path: '/generators',
      title: 'Generators',
      description: 'UUID, password, and Lorem Ipsum generators',
      icon: '🆔',
      toolCount: 3
    },
    {
      path: '/text',
      title: 'Text Tools',
      description: 'Case conversion and text manipulation tools',
      icon: '🔤',
      toolCount: 1
    }
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">One Toys</h1>
      <p className="home-subtitle">
        Essential developer tools for encoding, formatting, and text conversion
      </p>
      
      <div className="tools-grid">
        {categories.map((category) => (
          <Link key={category.path} to={category.path} className="tool-card category-card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <div className="category-meta">
              <span className="tool-count">{category.toolCount} tool{category.toolCount > 1 ? 's' : ''}</span>
              <span className="category-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
