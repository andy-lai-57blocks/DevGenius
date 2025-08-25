import React, { useState } from 'react';

const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState(null);

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
          className="text-area"
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
          placeholder="Formatted JSON will appear here..."
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

export default JSONFormatter;
