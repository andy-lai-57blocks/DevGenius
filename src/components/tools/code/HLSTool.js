import React, { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';

const HLSTool = () => {
  const [hlsUrl, setHlsUrl] = useState('');
  const [error, setError] = useState('');
  const [streamInfo, setStreamInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [availableLevels, setAvailableLevels] = useState([]);
  const [streamStats, setStreamStats] = useState({
    loadTime: 0,
    bufferLength: 0,
    droppedFrames: 0
  });
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Sample HLS streams for testing
  const sampleStreams = [
    {
      name: 'Apple Basic Stream',
      url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
      description: 'Apple\'s reference HLS stream with multiple qualities'
    },
    {
      name: 'Big Buck Bunny',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      description: 'Test stream with adaptive bitrates'
    },
    {
      name: 'Sintel Trailer',
      url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
      description: 'Short film trailer in HLS format'
    }
  ];

  useEffect(() => {
    // Update stream stats periodically
    const statsInterval = setInterval(() => {
      if (hlsRef.current && videoRef.current) {
        const hls = hlsRef.current;
        const video = videoRef.current;
        
        setStreamStats({
          loadTime: hls.stats?.total?.loading?.end || 0,
          bufferLength: video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) - video.currentTime : 0,
          droppedFrames: video.getVideoPlaybackQuality ? video.getVideoPlaybackQuality().droppedVideoFrames : 0
        });
      }
    }, 1000);

    return () => clearInterval(statsInterval);
  }, []);

  const loadHLS = (url) => {
    if (!url) {
      setError('Please enter a valid HLS URL');
      return;
    }

    setError('');
    setStreamInfo(null);
    setAvailableLevels([]);
    setCurrentLevel(-1);

    if (Hls.isSupported()) {
      // Destroy existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log('Manifest loaded, found ' + data.levels.length + ' quality level(s)');
        
        setStreamInfo({
          levels: data.levels.length,
          duration: data.totalduration || 'Live',
          type: data.levels[0]?.details?.live ? 'Live' : 'VOD'
        });
        
        setAvailableLevels(data.levels.map((level, index) => ({
          index,
          height: level.height,
          width: level.width,
          bitrate: level.bitrate,
          fps: level.attrs?.['FRAME-RATE'],
          codecs: level.codecs
        })));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error: Unable to load the stream');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error: Unable to decode the stream');
              hls.recoverMediaError();
              break;
            default:
              setError('Fatal error: Unable to play the stream');
              hls.destroy();
              break;
          }
        }
      });

    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      videoRef.current.src = url;
      setStreamInfo({
        levels: 1,
        duration: 'Unknown',
        type: 'Native HLS'
      });
    } else {
      setError('HLS is not supported in this browser');
    }
  };



  const handleLevelChange = (levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentLevel(levelIndex);
    }
  };

  const loadSample = (url) => {
    setHlsUrl(url);
    loadHLS(url);
  };

  const handleCopyPlaylist = () => {
    if (hlsUrl) {
      navigator.clipboard.writeText(hlsUrl).then(() => {
        // Could add a toast notification here
      });
    }
  };

  const formatBitrate = (bitrate) => {
    if (bitrate >= 1000000) {
      return (bitrate / 1000000).toFixed(1) + ' Mbps';
    } else if (bitrate >= 1000) {
      return (bitrate / 1000).toFixed(0) + ' Kbps';
    }
    return bitrate + ' bps';
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>HLS Stream Player & Analyzer</h2>
        <p>Play and analyze HTTP Live Streaming (HLS) content with detailed stream information</p>
      </div>

      <div className="input-group">
        <label className="input-label">HLS Stream URL (.m3u8)</label>
        <div className="input-with-button">
          <input
            type="text"
            className="text-input"
            value={hlsUrl}
            onChange={(e) => setHlsUrl(e.target.value)}
            placeholder="https://example.com/stream/playlist.m3u8"
            onKeyPress={(e) => e.key === 'Enter' && loadHLS(hlsUrl)}
          />
          <button 
            className="btn btn-primary" 
            onClick={() => loadHLS(hlsUrl)}
            disabled={!hlsUrl.trim()}
          >
            Load Stream
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Sample Streams */}
      <div className="input-group">
        <label className="input-label">Sample HLS Streams</label>
        <div className="sample-streams">
          {sampleStreams.map((stream, index) => (
            <div key={index} className="sample-stream-item">
              <div className="sample-stream-info">
                <strong>{stream.name}</strong>
                <p>{stream.description}</p>
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => loadSample(stream.url)}
              >
                Load
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player */}
      <div className="input-group">
        <label className="input-label">Video Player</label>
        <div className="hls-player-container">
          <video 
            ref={videoRef}
            className="hls-video-player"
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            poster="data:image/svg+xml,%3Csvg width='800' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%236b7280' text-anchor='middle' dy='.3em'%3ELoad an HLS stream to start playback%3C/text%3E%3C/svg%3E"
          />
          
          {streamInfo && (
            <div className="player-overlay">
              <div className="stream-indicator">
                <span className={`stream-status ${streamInfo.type === 'Live' ? 'live' : 'vod'}`}>
                  {streamInfo.type === 'Live' ? '🔴 LIVE' : '▶️ VOD'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stream Information */}
      {streamInfo && (
        <div className="stream-info-section">
          <h3>📊 Stream Information</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>🎬 Stream Details</h4>
              <ul>
                <li><strong>Type:</strong> {streamInfo.type}</li>
                <li><strong>Quality Levels:</strong> {streamInfo.levels}</li>
                <li><strong>Duration:</strong> {streamInfo.duration}</li>
                <li><strong>Current Level:</strong> {currentLevel >= 0 ? currentLevel : 'Auto'}</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h4>📈 Real-time Stats</h4>
              <ul>
                <li><strong>Buffer Length:</strong> {formatDuration(streamStats.bufferLength)}</li>
                <li><strong>Load Time:</strong> {streamStats.loadTime}ms</li>
                <li><strong>Dropped Frames:</strong> {streamStats.droppedFrames}</li>
                <li><strong>Status:</strong> {isPlaying ? '▶️ Playing' : '⏸️ Paused'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quality Levels */}
      {availableLevels.length > 0 && (
        <div className="quality-levels-section">
          <h3>🎯 Available Quality Levels</h3>
          <div className="quality-levels-grid">
            {availableLevels.map((level) => (
              <div 
                key={level.index} 
                className={`quality-level-card ${currentLevel === level.index ? 'active' : ''}`}
                onClick={() => handleLevelChange(level.index)}
              >
                <div className="quality-resolution">{level.width} × {level.height}</div>
                <div className="quality-bitrate">{formatBitrate(level.bitrate)}</div>
                <div className="quality-fps">{level.fps ? `${level.fps} FPS` : 'Variable FPS'}</div>
                <div className="quality-codecs">{level.codecs}</div>
                {currentLevel === level.index && <div className="quality-active-indicator">●</div>}
              </div>
            ))}
            <div 
              className={`quality-level-card ${currentLevel === -1 ? 'active' : ''}`}
              onClick={() => handleLevelChange(-1)}
            >
              <div className="quality-resolution">Auto</div>
              <div className="quality-bitrate">Adaptive</div>
              <div className="quality-fps">Dynamic</div>
              <div className="quality-codecs">Best Quality</div>
              {currentLevel === -1 && <div className="quality-active-indicator">●</div>}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {hlsUrl && (
        <div className="button-group">
          <button className="btn btn-outline" onClick={handleCopyPlaylist}>
            📋 Copy URL
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => window.open(hlsUrl, '_blank')}
          >
            🔗 Open Playlist
          </button>
          {hlsRef.current && (
            <button 
              className="btn btn-outline" 
              onClick={() => {
                hlsRef.current.destroy();
                setStreamInfo(null);
                setHlsUrl('');
                setError('');
                videoRef.current.src = '';
              }}
            >
              🗑️ Clear
            </button>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="info-section">
        <h3>📚 About HLS Streaming</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>🎬 What is HLS?</h4>
            <p>
              HTTP Live Streaming (HLS) is a media streaming protocol developed by Apple. 
              It delivers content by breaking the overall stream into small HTTP-based file downloads.
            </p>
          </div>
          <div className="info-item">
            <h4>📱 Compatibility</h4>
            <p>
              Native support in Safari, iOS, and macOS. Other browsers use hls.js for playback.
              Supports adaptive bitrate streaming and live broadcasts.
            </p>
          </div>
          <div className="info-item">
            <h4>🔧 Features</h4>
            <ul>
              <li>Adaptive bitrate streaming</li>
              <li>Multiple quality levels</li>
              <li>Live and on-demand content</li>
              <li>Cross-platform compatibility</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>💡 Use Cases</h4>
            <ul>
              <li>Live streaming events</li>
              <li>Video on demand services</li>
              <li>Mobile app streaming</li>
              <li>Broadcast television</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HLSTool;
