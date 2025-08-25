import React, { useState } from 'react';

const UUIDGenerator = () => {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState('v4');

  const generateUUID = () => {
    if (version === 'v4') {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } else {
      // Simple v1-like UUID with timestamp
      const timestamp = Date.now().toString(16);
      const random = Math.random().toString(16).substring(2, 15);
      return `${timestamp.substring(0, 8)}-${timestamp.substring(8)}-1xxx-yxxx-${random}`.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };

  const handleGenerate = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID());
    }
    setUuids(newUuids);
  };

  const handleCopy = async (uuid) => {
    try {
      await navigator.clipboard.writeText(uuid);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = uuid;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleCopyAll = async () => {
    const allUuids = uuids.join('\n');
    try {
      await navigator.clipboard.writeText(allUuids);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = allUuids;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>UUID Generator</h2>
        <p>Generate universally unique identifiers (UUIDs) for your applications</p>
      </div>

      <div className="input-group">
        <label className="input-label">UUID Version</label>
        <div className="button-group">
          <button
            className={`btn ${version === 'v4' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setVersion('v4')}
          >
            Version 4 (Random)
          </button>
          <button
            className={`btn ${version === 'v1' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setVersion('v1')}
          >
            Version 1 (Timestamp)
          </button>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Number of UUIDs</label>
        <input
          type="number"
          className="text-input"
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
          min="1"
          max="50"
          style={{ width: '150px' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={handleGenerate}>
          Generate UUID{count > 1 ? 's' : ''}
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      {uuids.length > 0 && (
        <>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label">Generated UUIDs</label>
              <button className="btn btn-outline btn-small" onClick={handleCopyAll}>
                Copy All
              </button>
            </div>
            <div className="uuid-list">
              {uuids.map((uuid, index) => (
                <div key={index} className="uuid-item">
                  <span className="uuid-text">{uuid}</span>
                  <button 
                    className="btn btn-outline btn-small"
                    onClick={() => handleCopy(uuid)}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UUIDGenerator;
