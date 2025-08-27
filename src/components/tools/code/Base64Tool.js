import React, { useState } from 'react';
import { downloadAsFile, getDownloadInfo } from '../../../utils/downloadUtils';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (error) {
      setOutput('Error: Unable to encode the input text');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch (error) {
      setOutput('Error: Invalid Base64 input');
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

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>Base64 Encoder/Decoder</h2>
        <p>Encode and decode text using Base64 encoding scheme</p>
      </div>

      <div className="input-group">
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

      <div className="input-group">
        <label className="input-label">
          {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
        </label>
        <textarea
          className="text-area code-editor"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
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
          className="text-area code-editor"
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
          {mode === 'decode' && (
            <button 
              className="btn btn-outline" 
              onClick={handleDownload}
              title={getDownloadInfo(output).description}
            >
              📥 Download as {getDownloadInfo(output).type}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Base64Tool;
