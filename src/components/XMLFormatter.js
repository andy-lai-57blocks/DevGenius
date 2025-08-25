import React, { useState } from 'react';

const XMLFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState(null);

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
          className="text-area"
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
        <textarea
          className="text-area"
          value={output}
          readOnly
          placeholder="Formatted XML will appear here..."
          style={{ 
            minHeight: '200px',
            borderColor: isValid === false ? '#ef4444' : isValid === true ? '#10b981' : '#d1d5db'
          }}
        />
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
