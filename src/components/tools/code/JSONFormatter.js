import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SimpleAd from '../../ads/SimpleAd';

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
  const [autoUnescape, setAutoUnescape] = useState(true);

  // Helper function to detect if input appears to be escaped JSON
  const isEscapedJSON = (str) => {
    if (!str || str.length < 2) return false;
    const trimmed = str.trim();
    
    // Check for common JSON escape patterns
    const hasEscapedQuotes = trimmed.includes('\\"');
    const hasEscapedSlashes = trimmed.includes('\\/');
    const hasEscapedNewlines = trimmed.includes('\\n') || trimmed.includes('\\r') || trimmed.includes('\\t');
    const hasEscapedBackslashes = trimmed.includes('\\\\');
    
    // If wrapped in quotes, check for escape patterns
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return hasEscapedQuotes || hasEscapedSlashes || hasEscapedNewlines || hasEscapedBackslashes;
    }
    
    // Even without outer quotes, check if content has escaped JSON patterns and looks like JSON
    if ((trimmed.startsWith('{\\"') || trimmed.startsWith('[\\"')) && 
        (hasEscapedQuotes || hasEscapedSlashes || hasEscapedNewlines)) {
      return true;
    }
    
    return false;
  };

  // Helper function to unescape JSON string
  const unescapeJSON = (str) => {
    try {
      let content = str.trim();
      
      // If wrapped in quotes, remove them first
      if ((content.startsWith('"') && content.endsWith('"')) ||
          (content.startsWith("'") && content.endsWith("'"))) {
        content = content.slice(1, -1);
      }
      
      // Use JSON.parse with a wrapper to handle most escape sequences properly
      try {
        return JSON.parse(`"${content}"`);
      } catch (e) {
        // If JSON.parse fails, do manual unescaping
        return content
          .replace(/\\"/g, '"')        // Escaped quotes
          .replace(/\\'/g, "'")        // Escaped single quotes
          .replace(/\\\//g, '/')       // Escaped forward slashes
          .replace(/\\\\/g, '\\')      // Escaped backslashes
          .replace(/\\n/g, '\n')       // Escaped newlines
          .replace(/\\r/g, '\r')       // Escaped carriage returns
          .replace(/\\t/g, '\t')       // Escaped tabs
          .replace(/\\f/g, '\f')       // Escaped form feeds
          .replace(/\\b/g, '\b');      // Escaped backspaces
      }
    } catch (error) {
      // If unescaping fails, return original string
      return str;
    }
  };

  // Helper function to prepare input for processing
  const prepareInput = (rawInput) => {
    if (!autoUnescape || !rawInput) return rawInput;
    
    if (isEscapedJSON(rawInput)) {
      return unescapeJSON(rawInput);
    }
    return rawInput;
  };


  const formatJSON = () => {
    try {
      const processedInput = prepareInput(input);
      const parsed = JSON.parse(processedInput);
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
      const processedInput = prepareInput(input);
      const parsed = JSON.parse(processedInput);
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
      const processedInput = prepareInput(input);
      JSON.parse(processedInput);
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
    <div className={`tool-container ${isDarkTheme ? 'dark-mode' : ''}`}>
      <div className="three-column-layout">
        {/* Input Column */}
        <div className="input-column">
          <div className="input-group">
            <label className="input-label">JSON Input</label>
            <textarea
              className="text-area code-input enhanced-code-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              spellCheck={false}
              style={{
                minHeight: 'calc(100vh - 16rem)',
                border: `2px solid ${isDarkTheme ? '#4a5568' : '#d1d5db'}`,
                backgroundColor: isDarkTheme ? '#282c34' : '#fafafa',
                color: isDarkTheme ? '#abb2bf' : '#374151',
                borderRadius: '8px',
                fontFamily: "'Source Code Pro', 'Courier New', monospace",
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '1rem',
                resize: 'vertical',
                outline: 'none',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                tabSize: 2,
                MozTabSize: 2,
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = isDarkTheme ? '#60a5fa' : '#3b82f6';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDarkTheme ? '#4a5568' : '#d1d5db';
              }}
            />
          </div>
        </div>

        {/* Action Column */}
        <div className="action-column">
          <div className="primary-actions">
            <button className="btn btn-primary" onClick={formatJSON}>
              ✨ Format
            </button>
            <button className="btn btn-outline" onClick={minifyJSON}>
              🗜️ Minify
            </button>
            <button className="btn btn-primary" onClick={validateJSON}>
              ✅ Validate
            </button>
          </div>

          <div className="secondary-actions">
            <button className="btn btn-outline" onClick={loadSampleJSON}>
              📄 Sample
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => setAutoUnescape(!autoUnescape)}
              title={autoUnescape ? 'Disable auto-unescape' : 'Enable auto-unescape'}
            >
              {autoUnescape ? '🔓 Auto-Unescape' : '🔒 Manual'}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
            >
              {isDarkTheme ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button className="btn btn-outline" onClick={handleClear}>
              🗑️ Clear
            </button>
            {output && (
              <button className="btn btn-outline" onClick={handleCopy}>
                📋 Copy Result
              </button>
            )}
          </div>
          
          <SimpleAd />
        </div>

        {/* Output Column */}
        <div className="output-column">
          <div className="input-group">
            <label className="input-label">
              Result
              {isValid === true && <span className="status-indicator valid">✅ Valid</span>}
              {isValid === false && <span className="status-indicator invalid">❌ Invalid</span>}
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
                    minHeight: 'calc(100vh - 16rem)',
                    border: `2px solid ${isValid === true ? '#10b981' : (isDarkTheme ? '#4a5568' : '#d1d5db')}`,
                    backgroundColor: isDarkTheme ? '#282c34' : '#fafafa',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                    overflowX: 'auto'
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
                  minHeight: 'calc(100vh - 16rem)',
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
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;
