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
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "application/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("Invalid XML structure");
      }

      const formatted = formatXML(input.trim());
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
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "application/xml");
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      
      if (parseError.length > 0) {
        throw new Error("Invalid XML structure");
      }

      // Simple minification by removing extra whitespace
      const minified = input.replace(/>\s*</g, '><').trim();
      setOutput(minified);
      setIsValid(true);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsValid(false);
    }
  };

  const validateXML = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, "application/xml");
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
    <div className="tool-container">
      <div className="tool-header">
        <h2>XML Formatter</h2>
        <p>Format, validate, and beautify XML documents</p>
      </div>

      <div className="input-group">
        <label className="input-label">XML Input</label>
        <textarea
          className="text-area code-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your XML here..."
          style={{ minHeight: '200px' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={handleFormat}>
          Format
        </button>
        <button className="btn btn-secondary" onClick={minifyXML}>
          Minify
        </button>
        <button className="btn btn-outline" onClick={validateXML}>
          Validate
        </button>
        <button className="btn btn-outline" onClick={loadSampleXML}>
          Load Sample
        </button>
        <button className="btn btn-outline" onClick={() => setIsDarkTheme(!isDarkTheme)}>
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
              language="xml"
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
            {output || 'Formatted XML will appear here...'}
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

export default XMLFormatter;
