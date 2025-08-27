import React, { useState } from 'react';
import * as pako from 'pako';
import { downloadAsFile, getDownloadInfo } from '../../../utils/downloadUtils';

const GzipTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('compress'); // 'compress' or 'decompress'

  const handleCompress = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }
      // Compress the input string and encode as base64
      const compressed = pako.gzip(input);
      const result = btoa(String.fromCharCode.apply(null, compressed));
      setOutput(result);
    } catch (error) {
      setOutput('Error: Unable to compress the input text');
    }
  };

  const handleDecompress = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }
      // Decompress from base64
      const binaryString = atob(input);
      const compressed = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        compressed[i] = binaryString.charCodeAt(i);
      }
      const decompressed = pako.ungzip(compressed, { to: 'string' });
      setOutput(decompressed);
    } catch (error) {
      setOutput('Error: Unable to decompress the input data');
    }
  };

  const handleConvert = () => {
    if (mode === 'compress') {
      handleCompress();
    } else {
      handleDecompress();
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

  const loadSample = () => {
    if (mode === 'compress') {
      setInput('This is sample text for gzip compression. The more text you have with repeated patterns, the better the compression ratio you will achieve!');
    } else {
      setInput('H4sIAAAAAAAA/ytJLS4BAAx+f9gNAAAA'); // "Hello World!" compressed
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>Gzip Compression Tool</h2>
        <p>Compress and decompress text data using gzip algorithm</p>
      </div>

      <div className="input-group">
        <div className="tab-group">
          <button
            className={`tab-btn ${mode === 'compress' ? 'active' : ''}`}
            onClick={() => setMode('compress')}
          >
            Compress
          </button>
          <button
            className={`tab-btn ${mode === 'decompress' ? 'active' : ''}`}
            onClick={() => setMode('decompress')}
          >
            Decompress
          </button>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">
          {mode === 'compress' ? 'Text to Compress' : 'Base64 Data to Decompress'}
        </label>
        <textarea
          className="text-area code-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'compress' ? 'Enter text to compress...' : 'Paste base64 compressed data here...'}
          style={{ minHeight: '200px' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={handleConvert}>
          {mode === 'compress' ? 'Compress' : 'Decompress'}
        </button>
        <button className="btn btn-outline" onClick={loadSample}>
          Load Sample
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="input-group">
        <label className="input-label">
          {mode === 'compress' ? 'Compressed Result (Base64)' : 'Decompressed Result'}
        </label>
        {output ? (
          <textarea
            className="text-area code-input"
            value={output}
            readOnly
            style={{ minHeight: '200px' }}
          />
        ) : (
          <div 
            className="code-placeholder"
            style={{
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#fafafa',
              color: '#6b7280',
              fontStyle: 'italic'
            }}
          >
            Result will appear here...
          </div>
        )}
      </div>

      {output && (
        <div className="button-group">
          <button className="btn btn-outline" onClick={handleCopy}>
            Copy Result
          </button>
          {mode === 'decompress' && (
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

export default GzipTool;
