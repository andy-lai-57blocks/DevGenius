import React from 'react';
import { Link } from 'react-router-dom';

const Info = () => {
  const tools = [
    {
      path: '/info/system',
      title: 'System Information',
      description: 'View browser and system information',
      icon: '💻',
      category: 'System'
    },
    {
      path: '/info/network',
      title: 'Network Information',
      description: 'Check IP address and network details',
      icon: '🌐',
      category: 'Network'
    },
    {
      path: '/info/browser',
      title: 'Browser Information',
      description: 'View browser capabilities and features',
      icon: '🌍',
      category: 'Browser'
    },
    {
      path: '/info/calling-codes',
      title: 'International Calling Codes',
      description: 'Search and lookup country calling codes worldwide',
      icon: '📞',
      category: 'Lookup'
    },
    {
      path: '/info/public-services',
      title: 'Public Service Numbers',
      description: 'Find government, emergency, and public service phone numbers',
      icon: '🏛️',
      category: 'Lookup'
    },
    {
      path: '/info/postcodes',
      title: 'Postal Code Lookup',
      description: 'Search postal codes, ZIP codes, and postcodes worldwide',
      icon: '📮',
      category: 'Lookup'
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

  // Define category order with Lookup first
  const categoryOrder = ['Lookup', 'System', 'Network', 'Browser'];
  const orderedGroupedTools = categoryOrder
    .filter(category => groupedTools[category]) // Only include categories that exist
    .map(category => [category, groupedTools[category]]);

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>ℹ️ Info Tools</h1>
        <p>Lookup tools, system information, and browser utilities</p>
      </div>
      
      {orderedGroupedTools.map(([category, categoryTools], groupIndex) => (
        <div key={category} className="tool-group">
          <h2 className="group-title">{category}</h2>
          <div className="tools-grid">
            {categoryTools.map((tool, index) => {
              const globalIndex = orderedGroupedTools.slice(0, groupIndex).reduce((acc, [, tools]) => acc + tools.length, 0) + index;
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

export default Info;
