import React, { useState, useEffect } from 'react';

const CaseConverter = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState({
    lowercase: '',
    uppercase: '',
    titleCase: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: '',
    constantCase: ''
  });

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const toCamelCase = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  };

  const toPascalCase = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
  };

  const toSnakeCase = (str) => {
    return str
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  };

  const toKebabCase = (str) => {
    return str
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-');
  };

  const toConstantCase = (str) => {
    return str
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toUpperCase())
      .join('_');
  };

  useEffect(() => {
    if (input.trim()) {
      setResults({
        lowercase: input.toLowerCase(),
        uppercase: input.toUpperCase(),
        titleCase: toTitleCase(input),
        camelCase: toCamelCase(input),
        pascalCase: toPascalCase(input),
        snakeCase: toSnakeCase(input),
        kebabCase: toKebabCase(input),
        constantCase: toConstantCase(input)
      });
    } else {
      setResults({
        lowercase: '',
        uppercase: '',
        titleCase: '',
        camelCase: '',
        pascalCase: '',
        snakeCase: '',
        kebabCase: '',
        constantCase: ''
      });
    }
  }, [input]);

  const handleClear = () => {
    setInput('');
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const loadSampleText = () => {
    setInput('Hello World Example Text');
  };

  const caseTypes = [
    { key: 'lowercase', label: 'lowercase', description: 'all lowercase letters' },
    { key: 'uppercase', label: 'UPPERCASE', description: 'all uppercase letters' },
    { key: 'titleCase', label: 'Title Case', description: 'first letter of each word capitalized' },
    { key: 'camelCase', label: 'camelCase', description: 'first word lowercase, subsequent words capitalized' },
    { key: 'pascalCase', label: 'PascalCase', description: 'all words capitalized, no spaces' },
    { key: 'snakeCase', label: 'snake_case', description: 'words separated by underscores' },
    { key: 'kebabCase', label: 'kebab-case', description: 'words separated by hyphens' },
    { key: 'constantCase', label: 'CONSTANT_CASE', description: 'uppercase with underscores' }
  ];

  return (
    <div className="tool-container">
      <div className="input-group">
        <label className="input-label">Input Text</label>
        <textarea
          className="text-area"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert..."
          style={{ minHeight: '120px' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-outline" onClick={loadSampleText}>
          Load Sample
        </button>
        <button className="btn btn-outline" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="case-results">
        {caseTypes.map((caseType) => (
          <div key={caseType.key} className="case-result-item">
            <div className="case-header">
              <div>
                <span className="case-label">{caseType.label}</span>
                <span className="case-description">{caseType.description}</span>
              </div>
              <button 
                className="btn btn-outline btn-small"
                onClick={() => handleCopy(results[caseType.key])}
                disabled={!results[caseType.key]}
              >
                Copy
              </button>
            </div>
            <div className="case-result">
              {results[caseType.key] || 'Enter text above to see conversion...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseConverter;
