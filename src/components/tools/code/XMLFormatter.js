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
  '.token.tag': { color: '#e06c75' },
  '.token.attr-name': { color: '#d19a66' },
  '.token.attr-value': { color: '#98c379' },
  '.token.string': { color: '#98c379' },
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
  '.token.tag': { color: '#e74c3c' },
  '.token.attr-name': { color: '#e67e22' },
  '.token.attr-value': { color: '#16a085' },
  '.token.string': { color: '#16a085' },
  '.token.punctuation': { color: '#1f2937' }
};

const XMLFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [autoUnescape, setAutoUnescape] = useState(true);

  // Helper function to detect if input appears to be escaped XML
  const isEscapedXML = (str) => {
    if (!str || str.length < 2) return false;
    const trimmed = str.trim();
    
    // Check for common XML/JSON escape patterns in the content
    const hasEscapedSlashes = trimmed.includes('\\/');
    const hasEscapedQuotes = trimmed.includes('\\"');
    const hasEscapedNewlines = trimmed.includes('\\n') || trimmed.includes('\\r');
    const hasHTMLEntities = trimmed.includes('&lt;') || trimmed.includes('&gt;') || 
                           trimmed.includes('&amp;') || trimmed.includes('&quot;');
    
    // If wrapped in quotes, check for escape patterns
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return hasEscapedSlashes || hasEscapedQuotes || hasEscapedNewlines || hasHTMLEntities;
    }
    
    // Even without outer quotes, check if content has escaped XML patterns
    // This handles cases where XML is escaped but not wrapped in quotes
    if (trimmed.startsWith('<?xml') || trimmed.includes('<\\/')) {
      return hasEscapedSlashes || hasEscapedQuotes || hasEscapedNewlines;
    }
    
    return false;
  };

  // Helper function to unescape XML string
  const unescapeXML = (str) => {
    try {
      let content = str.trim();
      
      // If wrapped in quotes, remove them first
      if ((content.startsWith('"') && content.endsWith('"')) ||
          (content.startsWith("'") && content.endsWith("'"))) {
        content = content.slice(1, -1);
      }
      
      // Handle JSON-style escaping (most common)
      content = content
        .replace(/\\"/g, '"')        // Escaped quotes
        .replace(/\\'/g, "'")        // Escaped single quotes
        .replace(/\\\//g, '/')       // Escaped forward slashes
        .replace(/\\\\/g, '\\')      // Escaped backslashes
        .replace(/\\n/g, '\n')       // Escaped newlines
        .replace(/\\r/g, '\r')       // Escaped carriage returns
        .replace(/\\t/g, '\t')       // Escaped tabs
        .replace(/\\f/g, '\f')       // Escaped form feeds
        .replace(/\\b/g, '\b');      // Escaped backspaces
      
      // Handle HTML/XML entity escaping
      content = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      
      return content;
    } catch (error) {
      // If unescaping fails, return original string
      return str;
    }
  };

  // Helper function to prepare input for processing
  const prepareInput = (rawInput) => {
    if (!autoUnescape || !rawInput) return rawInput;
    
    if (isEscapedXML(rawInput)) {
      return unescapeXML(rawInput);
    }
    return rawInput;
  };

  const formatXML = (xml) => {
    let formatted = '';
    let pad = 0;
    
    xml.split(/>\s*</).forEach(function(node, index) {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      const padding = '  '.repeat(pad);
      formatted += padding + '<' + node + '>\n';
      pad += indent;
    });

    return formatted.substring(1, formatted.length - 2);
  };

  const handleFormat = () => {
    try {
      // Basic XML validation using DOMParser
      const processedInput = prepareInput(input);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(processedInput, "application/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("Invalid XML structure");
      }

      const formatted = formatXML(processedInput.trim());
      setOutput(formatted);
      setIsValid(true);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsValid(false);
    }
  };

  const minifyXML = () => {
    try {
      // Basic validation first
      const processedInput = prepareInput(input);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(processedInput, "application/xml");
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      
      if (parseError.length > 0) {
        throw new Error("Invalid XML structure");
      }

      // Simple minification by removing extra whitespace
      const minified = processedInput.replace(/>\s*</g, '><').trim();
      setOutput(minified);
      setIsValid(true);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsValid(false);
    }
  };

  const validateXML = () => {
    try {
      const processedInput = prepareInput(input);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(processedInput, "application/xml");
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      
      if (parseError.length > 0) {
        throw new Error("Invalid XML structure");
      }
      
      setOutput('✅ Valid XML');
      setIsValid(true);
    } catch (error) {
      setOutput(`❌ Invalid XML: ${error.message}`);
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

  const loadSampleXML = () => {
    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book id="1">
    <title>JavaScript: The Good Parts</title>
    <author>Douglas Crockford</author>
    <price currency="USD">29.99</price>
    <categories>
      <category>Programming</category>
      <category>Web Development</category>
    </categories>
  </book>
  <book id="2">
    <title>Clean Code</title>
    <author>Robert C. Martin</author>
    <price currency="USD">35.99</price>
  </book>
</bookstore>`;
    setInput(sampleXML);
  };

  return (
    <div className={`tool-container ${isDarkTheme ? 'dark-mode' : ''}`}>
      <div className="three-column-layout">
        {/* Input Column */}
        <div className="input-column">
          <div className="input-group">
            <label className="input-label">XML Input</label>
            <textarea
              className="text-area code-input enhanced-code-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your XML here..."
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
            <button className="btn btn-primary" onClick={handleFormat}>
              ✨ Format
            </button>
            <button className="btn btn-outline" onClick={minifyXML}>
              🗜️ Minify
            </button>
            <button className="btn btn-primary" onClick={validateXML}>
              ✅ Validate
            </button>
          </div>

          <div className="secondary-actions">
            <button className="btn btn-outline" onClick={loadSampleXML}>
              📄 Sample
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => setAutoUnescape(!autoUnescape)}
              title={autoUnescape ? 'Disable auto-unescape' : 'Enable auto-unescape'}
            >
              {autoUnescape ? '🔓 Auto-Unescape' : '🔒 Manual'}
            </button>
            <button className="btn btn-outline" onClick={() => setIsDarkTheme(!isDarkTheme)}>
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
                  language="xml"
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
                {output || 'Formatted XML will appear here...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XMLFormatter;
