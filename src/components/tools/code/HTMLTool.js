import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { downloadAsFile, getDownloadInfo } from '../../../utils/downloadUtils';
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
  '.token.punctuation': { color: '#abb2bf' },
  '.token.comment': { color: '#5c6370' },
  '.token.doctype': { color: '#c678dd' }
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
  '.token.tag': { color: '#dc2626' },
  '.token.attr-name': { color: '#b45309' },
  '.token.attr-value': { color: '#16a34a' },
  '.token.string': { color: '#16a34a' },
  '.token.punctuation': { color: '#6b7280' },
  '.token.comment': { color: '#6b7280' },
  '.token.doctype': { color: '#9333ea' }
};

const HTMLTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('decode'); // 'encode' or 'decode'
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  const reverseHtmlEntities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#39;': "'",
    '&#x2F;': '/',
    '&#47;': '/'
  };

  const handleEncode = () => {
    try {
      let encoded = input;
      Object.keys(htmlEntities).forEach(char => {
        encoded = encoded.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), htmlEntities[char]);
      });
      setOutput(encoded);
    } catch (error) {
      setOutput('Error: Unable to encode the input text');
    }
  };

  const handleDecode = () => {
    try {
      let decoded = input;
      Object.keys(reverseHtmlEntities).forEach(entity => {
        decoded = decoded.replace(new RegExp(entity, 'g'), reverseHtmlEntities[entity]);
      });
      setOutput(decoded);
    } catch (error) {
      setOutput('Error: Unable to decode the input text');
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
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

  const handleDownload = () => {
    const success = downloadAsFile(output);
    if (!success) {
      console.error('Failed to download file');
    }
  };

  const loadSampleHTML = () => {
    const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Document</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .highlight { background-color: yellow; }
    </style>
</head>
<body>
    <header>
        <h1>Welcome to Our Website</h1>
        <nav>
            <a href="#home">Home</a> | 
            <a href="#about">About</a> | 
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Home Section</h2>
            <p>This is a <em>sample</em> paragraph with <strong>bold text</strong> and <span class="highlight">highlighted text</span>.</p>
            <ul>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
            </ul>
        </section>
        
        <section id="about">
            <h2>About Us</h2>
            <p>We are a company that specializes in web development & design.</p>
            <img src="sample.jpg" alt="Sample Image" width="300" height="200">
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Our Website. All rights reserved.</p>
    </footer>
</body>
</html>`;
    setInput(sampleHTML);
  };

  return (
    <div className={`tool-container ${isDarkTheme ? 'dark-mode' : ''}`}>
      <div className="three-column-layout">
        {/* Input Column */}
        <div className="input-column">
          <div className="input-group">
            <label className="input-label">
              {mode === 'encode' ? 'HTML/Text to Encode' : 'HTML Entities to Decode'}
            </label>
            <textarea
              className="text-area code-input enhanced-code-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter HTML or text to encode...' : 'Enter HTML entities to decode...'}
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
          <div className="mode-toggle">
            <div className="tab-group">
              <button
                className={`tab-btn ${mode === 'encode' ? 'active' : ''}`}
                onClick={() => setMode('encode')}
              >
                Encode
              </button>
              <button
                className={`tab-btn ${mode === 'decode' ? 'active' : ''}`}
                onClick={() => setMode('decode')}
              >
                Decode
              </button>
            </div>
          </div>

          <div className="primary-actions">
            <button className="btn btn-primary" onClick={handleConvert}>
              {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
            </button>
          </div>

          <div className="secondary-actions">
            <button className="btn btn-outline" onClick={loadSampleHTML}>
              📄 Sample
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
              <>
                <button className="btn btn-outline" onClick={handleCopy}>
                  📋 Copy
                </button>
                {mode === 'decode' && (
                  <button 
                    className="btn btn-outline" 
                    onClick={handleDownload}
                    title={getDownloadInfo(output).description}
                  >
                    📥 Download as {getDownloadInfo(output).type}
                  </button>
                )}
              </>
            )}
          </div>
          
          <SimpleAd type="mrec" />
        </div>

        {/* Output Column */}
        <div className="output-column">
          <div className="input-group">
            <label className="input-label">
              {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
            </label>
            {output ? (
              <div className={`code-output ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
                <SyntaxHighlighter
                  language={mode === 'decode' ? 'html' : 'text'}
                  style={isDarkTheme ? (oneDark || fallbackDarkTheme) : (oneLight || fallbackLightTheme)}
                  customStyle={{
                    margin: 0,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: "'Source Code Pro', 'Courier New', monospace",
                    minHeight: 'calc(100vh - 16rem)',
                    border: `2px solid ${isDarkTheme ? '#4a5568' : '#d1d5db'}`,
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${isDarkTheme ? '#4a5568' : '#d1d5db'}`,
                  borderRadius: '8px',
                  backgroundColor: isDarkTheme ? '#282c34' : '#fafafa',
                  color: isDarkTheme ? '#9ca3af' : '#6b7280',
                  fontStyle: 'italic'
                }}
              >
                Result will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLTool;
