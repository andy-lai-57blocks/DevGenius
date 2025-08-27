import React, { useState, useEffect } from 'react';

const CharacterCount = () => {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0
  });
  const [charFrequency, setCharFrequency] = useState({});

  // Calculate all statistics when input changes
  useEffect(() => {
    if (!input.trim()) {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0,
        speakingTime: 0
      });
      setCharFrequency({});
      return;
    }

    // Basic counts
    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, '').length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const sentences = input.trim() ? (input.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const lines = input ? input.split('\n').length : 0;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(words / 150);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime
    });

    // Character frequency analysis
    const frequency = {};
    const text = input.toLowerCase();
    for (let char of text) {
      if (char.match(/[a-z0-9]/)) {
        frequency[char] = (frequency[char] || 0) + 1;
      }
    }
    
    // Sort by frequency and take top 10
    const sortedFreq = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [char, count]) => {
        obj[char] = count;
        return obj;
      }, {});

    setCharFrequency(sortedFreq);
  }, [input]);

  const handleClear = () => {
    setInput('');
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const loadSampleText = () => {
    setInput(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`);
  };

  const copyAllStats = () => {
    const statsText = [
      `Text Statistics:`,
      `Characters: ${stats.characters}`,
      `Characters (no spaces): ${stats.charactersNoSpaces}`,
      `Words: ${stats.words}`,
      `Sentences: ${stats.sentences}`,
      `Paragraphs: ${stats.paragraphs}`,
      `Lines: ${stats.lines}`,
      `Reading time: ${stats.readingTime} minute${stats.readingTime !== 1 ? 's' : ''}`,
      `Speaking time: ${stats.speakingTime} minute${stats.speakingTime !== 1 ? 's' : ''}`
    ].join('\n');
    
    handleCopy(statsText);
  };

  const statItems = [
    { key: 'characters', label: 'Characters', value: stats.characters, icon: '🔤' },
    { key: 'charactersNoSpaces', label: 'Characters (no spaces)', value: stats.charactersNoSpaces, icon: '📝' },
    { key: 'words', label: 'Words', value: stats.words, icon: '📖' },
    { key: 'sentences', label: 'Sentences', value: stats.sentences, icon: '📄' },
    { key: 'paragraphs', label: 'Paragraphs', value: stats.paragraphs, icon: '📋' },
    { key: 'lines', label: 'Lines', value: stats.lines, icon: '📏' }
  ];

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>Character Count Tool</h2>
        <p>Analyze text with detailed character, word, and readability statistics</p>
      </div>

      <div className="input-group">
        <label className="input-label">Text to Analyze</label>
        <textarea
          className="text-area"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter or paste your text here to see detailed statistics..."
          style={{ minHeight: '200px' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-outline" onClick={loadSampleText}>
          Load Sample
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
        <button className="btn btn-outline" onClick={copyAllStats} disabled={!input.trim()}>
          Copy Stats
        </button>
      </div>

      {/* Basic Statistics */}
      <div className="char-count-section">
        <h3>📊 Basic Statistics</h3>
        <div className="stats-grid">
          {statItems.map((stat) => (
            <div key={stat.key} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value.toLocaleString()}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading & Speaking Time */}
      {stats.words > 0 && (
        <div className="char-count-section">
          <h3>⏱️ Time Estimates</h3>
          <div className="time-stats">
            <div className="time-item">
              <div className="time-icon">📚</div>
              <div className="time-content">
                <div className="time-value">{stats.readingTime} min</div>
                <div className="time-label">Reading time</div>
                <div className="time-note">~200 words/min</div>
              </div>
            </div>
            <div className="time-item">
              <div className="time-icon">🎤</div>
              <div className="time-content">
                <div className="time-value">{stats.speakingTime} min</div>
                <div className="time-label">Speaking time</div>
                <div className="time-note">~150 words/min</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Frequency */}
      {Object.keys(charFrequency).length > 0 && (
        <div className="char-count-section">
          <h3>🔍 Most Frequent Characters</h3>
          <div className="frequency-grid">
            {Object.entries(charFrequency).map(([char, count]) => (
              <div key={char} className="frequency-item">
                <div className="frequency-char">{char}</div>
                <div className="frequency-count">{count}</div>
                <div className="frequency-bar">
                  <div 
                    className="frequency-fill"
                    style={{ 
                      width: `${(count / Math.max(...Object.values(charFrequency))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Copy Options */}
      {input.trim() && (
        <div className="char-count-section">
          <h3>📋 Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="btn btn-outline btn-small"
              onClick={() => handleCopy(stats.characters.toString())}
            >
              Copy Character Count
            </button>
            <button 
              className="btn btn-outline btn-small"
              onClick={() => handleCopy(stats.words.toString())}
            >
              Copy Word Count
            </button>
            <button 
              className="btn btn-outline btn-small"
              onClick={() => handleCopy(input.trim())}
            >
              Copy Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCount;
