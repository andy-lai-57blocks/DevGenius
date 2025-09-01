import React, { useState } from 'react';
import * as pako from 'pako';
import { downloadAsFile, getDownloadInfo } from '../../../utils/downloadUtils';
import SimpleAd from '../../ads/SimpleAd';
import CodeEditor from '../../common/CodeEditor';

const GzipTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('decompress'); // 'compress' or 'decompress'

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
      <div className="three-column-layout">
        {/* Input Column */}
        <div className="input-column">
          <div className="input-group">
            <label className="input-label">
              {mode === 'compress' ? 'Text to Compress' : 'Base64 Data to Decompress'}
            </label>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="text"
              placeholder={mode === 'compress' ? 'Enter text to compress...' : 'Paste base64 compressed data here...'}
              name="gzip-input-editor"
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

          <div className="primary-actions">
            <button className="btn btn-primary" onClick={handleConvert}>
              {mode === 'compress' ? '🗜️ Compress' : '📂 Decompress'}
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
                {mode === 'decompress' && (
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
              {mode === 'compress' ? 'Compressed Result' : 'Decompressed Result'}
            </label>
            <CodeEditor
              value={output}
              onChange={() => {}} // Read-only
              language="text"
              readOnly={true}
              name="gzip-output-editor"
              height="calc(100vh - 16rem)"
              isDarkTheme={false}
              showLineNumbers={true}
              placeholder="Result will appear here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GzipTool;
