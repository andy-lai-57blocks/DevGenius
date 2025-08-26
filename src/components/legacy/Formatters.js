import React from 'react';
import { Link } from 'react-router-dom';

const Formatters = () => {
  const tools = [
    {
      path: '/formatters/json',
      title: 'JSON Formatter',
      description: 'Format, validate, and beautify JSON data',
      icon: '📋'
    },
    {
      path: '/formatters/xml',
      title: 'XML Formatter',
      description: 'Format, validate, and beautify XML documents',
      icon: '📄'
    }
  ];

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>📋 Formatters</h1>
        <p>Professional functions for formatting and validating structured data</p>
      </div>
      
      <div className="tool-group">
        <h2 className="group-title">Formatting Functions</h2>
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

export default Formatters;
