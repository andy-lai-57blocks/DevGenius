import React, { useState } from 'react';

const HTMLTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'

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

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>HTML Encoder/Decoder</h2>
        <p>Encode and decode HTML entities and special characters</p>
      </div>

      <div className="input-group">
        <div className="button-group">
          <button
            className={`btn ${mode === 'encode' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('encode')}
          >
            Encode
          </button>
          <button
            className={`btn ${mode === 'decode' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('decode')}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">
          {mode === 'encode' ? 'HTML/Text to Encode' : 'HTML Entities to Decode'}
        </label>
        <textarea
          className="text-area"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter HTML or text to encode...' : 'Enter HTML entities to decode...'}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={handleConvert}>
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="input-group">
        <label className="input-label">
          {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
        </label>
        <textarea
          className="text-area"
          value={output}
          readOnly
          placeholder="Result will appear here..."
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

export default HTMLTool;
