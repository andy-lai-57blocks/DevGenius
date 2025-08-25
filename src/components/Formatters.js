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
    <div className="tool-container">
      <div className="tool-header">
        <h2>Formatters</h2>
        <p>Tools for formatting and validating structured data</p>
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

export default Formatters;
