import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Fallback themes in case imports fail
const fallbackDarkTheme = {
  'code[class*="language-"]': {
    color: '#abb2bf',
    background: '#282c34',
    fontFamily: "'Source Code Pro', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '1.5'
  },
  'pre[class*="language-"]': {
    color: '#abb2bf',
    background: '#282c34',
    fontFamily: "'Source Code Pro', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '1.5'
  },
  '.token.string': { color: '#98c379' },
  '.token.number': { color: '#d19a66' },
  '.token.boolean': { color: '#56b6c2' },
  '.token.null': { color: '#56b6c2' },
  '.token.property': { color: '#e06c75' },
  '.token.punctuation': { color: '#abb2bf' }
};

const fallbackLightTheme = {
  'code[class*="language-"]': {
    color: '#1f2937',
    background: '#fafafa',
    fontFamily: "'Source Code Pro', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '1.5'
  },
  'pre[class*="language-"]': {
    color: '#1f2937',
    background: '#fafafa',
    fontFamily: "'Source Code Pro', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '1.5'
  },
  '.token.string': { color: '#16a085' },
  '.token.number': { color: '#e67e22' },
  '.token.boolean': { color: '#3498db' },
  '.token.null': { color: '#3498db' },
  '.token.property': { color: '#e74c3c' },
  '.token.punctuation': { color: '#1f2937' }
};

const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);



  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsValid(false);
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsValid(false);
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setOutput('✅ Valid JSON');
      setIsValid(true);
    } catch (error) {
      setOutput(`❌ Invalid JSON: ${error.message}`);
      setIsValid(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const loadSampleJSON = () => {
    const sampleJSON = {
      "name": "John Doe",
      "age": 30,
      "city": "New York",
      "hobbies": ["reading", "swimming", "coding"],
      "address": {
        "street": "123 Main St",
        "zipCode": "10001"
      },
      "isActive": true
    };
    setInput(JSON.stringify(sampleJSON));
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>JSON Formatter</h2>
        <p>Format, validate, and beautify JSON data</p>
      </div>

      <div className="input-group">
        <label className="input-label">JSON Input</label>
        <textarea
          className="text-area code-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JSON here..."
          style={{ minHeight: '200px' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={formatJSON}>
          Format
        </button>
        <button className="btn btn-secondary" onClick={minifyJSON}>
          Minify
        </button>
        <button className="btn btn-outline" onClick={validateJSON}>
          Validate
        </button>
        <button className="btn btn-outline" onClick={loadSampleJSON}>
          Load Sample
        </button>
        <button 
          className="btn btn-outline" 
          onClick={() => setIsDarkTheme(!isDarkTheme)}
        >
          {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="input-group">
        <label className="input-label">
          Result 
          {isValid === true && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✅ Valid</span>}
          {isValid === false && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>❌ Invalid</span>}
        </label>
        {output && isValid !== false ? (
          <div className={`code-output ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
            <SyntaxHighlighter
              language="json"
              style={isDarkTheme ? (oneDark || fallbackDarkTheme) : (oneLight || fallbackLightTheme)}
              customStyle={{
                margin: 0,
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Source Code Pro', 'Courier New', monospace",
                minHeight: '200px',
                border: `2px solid ${isValid === true ? '#10b981' : (isDarkTheme ? '#4a5568' : '#d1d5db')}`,
                backgroundColor: isDarkTheme ? '#282c34' : '#fafafa'
              }}
              wrapLongLines={true}
              showLineNumbers={false}
            >
              {output}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div 
            className={`code-placeholder ${isDarkTheme ? 'dark' : 'light'}`}
            style={{
              minHeight: '200px',
              border: `2px solid ${isValid === false ? '#ef4444' : (isDarkTheme ? '#4a5568' : '#d1d5db')}`,
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: isDarkTheme ? '#282c34' : '#f8fafc',
              fontFamily: "'Source Code Pro', 'Courier New', monospace",
              fontSize: '14px',
              color: isValid === false ? '#ef4444' : (isDarkTheme ? '#abb2bf' : '#64748b'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {output || 'Formatted JSON will appear here...'}
          </div>
        )}
      </div>

      {output && (
        <div className="button-group">
          <button className="btn btn-outline" onClick={handleCopy}>
            Copy Result
          </button>
        </div>
      )}
    </div>
  );
};

export default JSONFormatter;
