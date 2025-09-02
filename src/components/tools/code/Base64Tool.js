import React, { useState } from 'react';
import { downloadAsFile, getDownloadInfo } from '../../../utils/downloadUtils';
import SimpleAd from '../../ads/SimpleAd';
import CodeEditor from '../../common/CodeEditor';


// Removed fallback themes - now using Ace Editor built-in themes

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('decode'); // 'encode' or 'decode'
  const [contentType, setContentType] = useState('text'); // 'text', 'json', 'html'


  // Content detection functions
  const isValidJSON = (str) => {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  };

  const isHTML = (str) => {
    const htmlPattern = /<([a-z][a-z0-9]*)\b[^>]*>.*?<\/\1>/gi;
    const selfClosingPattern = /<([a-z][a-z0-9]*)\b[^>]*\/>/gi;
    const doctypePattern = /<!doctype\s+html/gi;
    
    return doctypePattern.test(str) || 
           htmlPattern.test(str) || 
           selfClosingPattern.test(str) ||
           str.toLowerCase().includes('<html') ||
           str.toLowerCase().includes('<div') ||
           str.toLowerCase().includes('<span');
  };

  const detectContentType = (content) => {
    const trimmed = content.trim();
    if (isValidJSON(trimmed)) {
      return 'json';
    } else if (isHTML(trimmed)) {
      return 'html';
    }
    return 'text';
  };

  // Content formatting functions
  const formatJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  const formatHTML = (htmlString) => {
    // Simple HTML formatting - add proper indentation
    let formatted = htmlString;
    let indent = 0;
    const tab = '  ';
    
    formatted = formatted.replace(/></g, '>\n<');
    
    const lines = formatted.split('\n');
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return '';
      
      if (trimmedLine.match(/<\/\w+>/)) {
        indent = Math.max(0, indent - 1);
      }
      
      const result = tab.repeat(indent) + trimmedLine;
      
      if (trimmedLine.match(/<\w+(?:\s[^>]*)?>/) && !trimmedLine.match(/<\/\w+>/)) {
        if (!trimmedLine.match(/\/>/)) {
          indent++;
        }
      }
      
      return result;
    });
    
    return formattedLines.join('\n');
  };

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setContentType('text'); // Reset content type for encoded output
    } catch (error) {
      setOutput('Error: Unable to encode the input text');
      setContentType('text');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      const type = detectContentType(decoded);
      setContentType(type);
      
      let formattedOutput = decoded;
      if (type === 'json') {
        formattedOutput = formatJSON(decoded);
      } else if (type === 'html') {
        formattedOutput = formatHTML(decoded);
      }
      
      setOutput(formattedOutput);
    } catch (error) {
      setOutput('Error: Invalid Base64 input');
      setContentType('text');
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
    setContentType('text');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      // You could add a toast notification here
    } catch (error) {
      // Fallback for older browsers
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

  const loadSample = () => {
    if (mode === 'encode') {
      // Load sample JSON for encoding
      const sampleJSON = {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30,
        "isActive": true,
        "hobbies": ["reading", "coding", "traveling"],
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zipCode": "10001"
        }
      };
      setInput(JSON.stringify(sampleJSON, null, 2));
    } else {
      // Load sample Base64 encoded HTML for decoding
      const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample HTML</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { color: #3b82f6; border-bottom: 2px solid #e5e7eb; }
    .content { margin: 20px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to Base64 Decoder</h1>
  </div>
  <div class="content">
    <p>This is a sample HTML document that was encoded in Base64.</p>
    <p>The decoder automatically detected it as HTML and formatted it with syntax highlighting!</p>
  </div>
</body>
</html>`;
      const encoded = btoa(unescape(encodeURIComponent(sampleHTML)));
      setInput(encoded);
    }
  };

  return (
    <div className="tool-container">
      <div className="three-column-layout">
        {/* Input Column */}
        <div className="input-column">
          <div className="input-group">
            <label className="input-label">
              {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
            </label>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="text"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
              name="base64-input-editor"
              height="calc(100vh - 16rem)"
              isDarkTheme={false}
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
            <button className="btn btn-outline" onClick={loadSample}>
              📄 Sample
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
          
          <SimpleAd />
        </div>

        {/* Output Column */}
        <div className="output-column">
          <div className="input-group">
            <label className="input-label">
              {mode === 'encode' ? 'Encoded Result' : `Decoded Result ${contentType !== 'text' ? `(${contentType.toUpperCase()})` : ''}`}
            </label>
            <CodeEditor
              value={output}
              onChange={() => {}} // Read-only
              language={contentType === 'json' ? 'json' : contentType === 'html' ? 'html' : 'text'}
              readOnly={true}
              name="base64-output-editor"
              height="calc(100vh - 16rem)"

              showLineNumbers={true}
              placeholder="Result will appear here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;
