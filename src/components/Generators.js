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
    <div className="tool-container">
      <div className="tool-header">
        <h2>Generators</h2>
        <p>Tools for generating various types of data and content</p>
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

export default Generators;
