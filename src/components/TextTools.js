import React from 'react';
import { Link } from 'react-router-dom';

const TextTools = () => {
  const tools = [
    {
      path: '/text/case-converter',
      title: 'Case Converter',
      description: 'Convert text between different case formats',
      icon: '🔤'
    }
  ];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>Text Tools</h2>
        <p>Tools for text manipulation and transformation</p>
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

export default TextTools;
