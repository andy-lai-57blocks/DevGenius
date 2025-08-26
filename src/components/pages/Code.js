import React from 'react';
import { Link } from 'react-router-dom';

const Code = () => {
  const tools = [
    // Encoders/Decoders
    {
      path: '/code/base64',
      title: 'Base64 Encoder/Decoder',
      description: 'Encode and decode Base64 strings',
      icon: '🔐',
      category: 'Encoding'
    },
    {
      path: '/code/url',
      title: 'URL Encoder/Decoder',
      description: 'Encode and decode URL strings',
      icon: '🌐',
      category: 'Encoding'
    },
    {
      path: '/code/html',
      title: 'HTML Encoder/Decoder',
      description: 'Encode and decode HTML entities',
      icon: '🏷️',
      category: 'Encoding'
    },
    // Formatters
    {
      path: '/code/json',
      title: 'JSON Formatter',
      description: 'Format, validate and minify JSON',
      icon: '📋',
      category: 'Formatting'
    },
    {
      path: '/code/xml',
      title: 'XML Formatter',
      description: 'Format, validate and minify XML',
      icon: '📄',
      category: 'Formatting'
    },
    // Generators
    {
      path: '/code/uuid',
      title: 'UUID Generator',
      description: 'Generate UUID v1, v4, and Nil UUIDs',
      icon: '🆔',
      category: 'Generators'
    },
    {
      path: '/code/password',
      title: 'Password Generator',
      description: 'Generate secure passwords with custom options',
      icon: '🔑',
      category: 'Generators'
    }
  ];

  const groupedTools = tools.reduce((groups, tool) => {
    const category = tool.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tool);
    return groups;
  }, {});

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>🖥️ Code Tools</h1>
        <p>Essential functions for encoding, decoding, and formatting various data types</p>
      </div>
      
      {Object.entries(groupedTools).map(([category, categoryTools], groupIndex) => (
        <div key={category} className="tool-group">
          <h2 className="group-title">{category}</h2>
          <div className="tools-grid">
            {categoryTools.map((tool, index) => {
              const globalIndex = Object.entries(groupedTools).slice(0, groupIndex).reduce((acc, [, tools]) => acc + tools.length, 0) + index;
              return (
                <Link 
                  key={tool.path} 
                  to={tool.path} 
                  className="tool-card category-card"
                  style={{ '--card-index': globalIndex }}
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
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Code;
