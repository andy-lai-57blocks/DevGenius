import React from 'react';
import { Link } from 'react-router-dom';

const Generators = () => {
  const tools = [
    {
      path: '/generators/uuid',
      title: 'UUID Generator',
      description: 'Generate universally unique identifiers (UUIDs)',
      icon: '🆔'
    },
    {
      path: '/generators/password',
      title: 'Password Generator',
      description: 'Generate secure passwords with customizable options',
      icon: '🔒'
    },
    {
      path: '/generators/lorem',
      title: 'Lorem Ipsum Generator',
      description: 'Generate placeholder text for designs and mockups',
      icon: '📃'
    }
  ];

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>🆔 Generators</h1>
        <p>Essential functions for generating various types of data and content</p>
      </div>
      
      <div className="tool-group">
        <h2 className="group-title">Generation Functions</h2>
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

export default Generators;
