import React, { useState } from 'react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false
  });

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O'
  };

  const generatePassword = () => {
    let charset = '';
    if (options.uppercase) charset += characters.uppercase;
    if (options.lowercase) charset += characters.lowercase;
    if (options.numbers) charset += characters.numbers;
    if (options.symbols) charset += characters.symbols;

    if (!charset) {
      setPassword('Please select at least one character type');
      return;
    }

    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !characters.similar.includes(char)).join('');
    }

    let result = '';
    for (let i = 0; i < options.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setPassword('');
  };

  const updateOption = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getPasswordStrength = () => {
    if (password.length < 8) return { text: 'Weak', className: 'strength-weak' };
    if (password.length < 12) return { text: 'Fair', className: 'strength-fair' };
    if (password.length < 16) return { text: 'Good', className: 'strength-good' };
    return { text: 'Strong', className: 'strength-strong' };
  };

  const strength = password ? getPasswordStrength() : null;

  return (
    <div className="tool-container">
      <div className="input-group">
        <label className="input-label">Password Length: {options.length}</label>
        <input
          type="range"
          min="4"
          max="128"
          value={options.length}
          onChange={(e) => updateOption('length', parseInt(e.target.value))}
          className="password-slider"
        />
      </div>

      <div className="input-group">
        <label className="input-label">Character Types</label>
        <div className="checkbox-group">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => updateOption('uppercase', e.target.checked)}
            />
            <span>Uppercase (A-Z)</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => updateOption('lowercase', e.target.checked)}
            />
            <span>Lowercase (a-z)</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => updateOption('numbers', e.target.checked)}
            />
            <span>Numbers (0-9)</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={(e) => updateOption('symbols', e.target.checked)}
            />
            <span>Symbols (!@#$%...)</span>
          </label>
        </div>
      </div>

      <div className="input-group">
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
          />
          <span>Exclude similar characters (i, l, 1, L, o, 0, O)</span>
        </label>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={generatePassword}>
          Generate Password
        </button>
        <button className="btn btn-outline" onClick={handleClear}>
          Clear
        </button>
      </div>

      {password && (
        <>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label">
                Generated Password 
                {strength && (
                  <span className={`password-strength ${strength.className}`}>
                    ({strength.text})
                  </span>
                )}
              </label>
              <button className="btn btn-outline btn-small" onClick={handleCopy}>
                Copy
              </button>
            </div>
            <div className="password-result">
              {password}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordGenerator;
