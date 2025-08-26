import React from 'react';
import { Link } from 'react-router-dom';

const DateTime = () => {
  const tools = [
    {
      path: '/datetime/timestamp',
      title: 'Timestamp Converter',
      description: 'Convert between timestamps and human-readable dates',
      icon: '⏰',
      category: 'Conversion'
    },
    {
      path: '/datetime/format',
      title: 'Date Formatter',
      description: 'Format dates in various formats and timezones',
      icon: '📅',
      category: 'Formatting'
    },
    {
      path: '/datetime/calculator',
      title: 'Date Calculator',
      description: 'Calculate date differences and add/subtract time',
      icon: '🧮',
      category: 'Calculation'
    },
    {
      path: '/datetime/timezone',
      title: 'Timezone Converter',
      description: 'Convert time between different timezones',
      icon: '🌍',
      category: 'Conversion'
    },
    {
      path: '/datetime/countdown',
      title: 'Countdown Tool',
      description: 'Track important dates with live countdowns',
      icon: '⏰',
      category: 'Tracking'
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
        <h1>🕐 DateTime Tools</h1>
        <p>Date and time conversion, formatting, and calculation tools</p>
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

export default DateTime;
