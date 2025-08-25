import React, { useState } from 'react';

const LoremGenerator = () => {
  const [output, setOutput] = useState('');
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
    'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
    'quas', 'molestias', 'excepturi', 'occaecati', 'cupiditate', 'similique', 'eleifend',
    'tellus', 'integer', 'feugiat', 'scelerisque', 'varius', 'morbi', 'enim', 'nunc',
    'faucibus', 'vitae', 'aliquet', 'nec', 'ullamcorper', 'mattis', 'pellentesque',
    'habitant', 'tristique', 'senectus', 'netus', 'malesuada', 'fames', 'turpis',
    'egestas', 'maecenas', 'pharetra', 'convallis', 'posuere', 'morbi', 'leo'
  ];

  const generateSentence = () => {
    const sentenceLength = Math.floor(Math.random() * 15) + 5; // 5-20 words
    const sentence = [];
    
    for (let i = 0; i < sentenceLength; i++) {
      const word = loremWords[Math.floor(Math.random() * loremWords.length)];
      sentence.push(i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
    }
    
    return sentence.join(' ') + '.';
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 6) + 3; // 3-8 sentences
    const sentences = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  const generateWords = (wordCount) => {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  };

  const generateLorem = () => {
    let result = '';
    
    switch (type) {
      case 'words':
        result = generateWords(count);
        break;
      case 'sentences':
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      case 'paragraphs':
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
    }
    
    setOutput(result);
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

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>Lorem Ipsum Generator</h2>
        <p>Generate placeholder text for your designs and mockups</p>
      </div>

      <div className="input-group">
        <label className="input-label">Generate Type</label>
        <div className="button-group">
          <button
            className={`btn ${type === 'words' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setType('words')}
          >
            Words
          </button>
          <button
            className={`btn ${type === 'sentences' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setType('sentences')}
          >
            Sentences
          </button>
          <button
            className={`btn ${type === 'paragraphs' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setType('paragraphs')}
          >
            Paragraphs
          </button>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">
          Number of {type}: {count}
        </label>
        <input
          type="range"
          min="1"
          max={type === 'words' ? 100 : type === 'sentences' ? 20 : 10}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="password-slider"
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={generateLorem}>
          Generate Lorem Ipsum
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      {output && (
        <>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="input-label">Generated Text</label>
              <button className="btn btn-outline btn-small" onClick={handleCopy}>
                Copy
              </button>
            </div>
            <textarea
              className="text-area"
              value={output}
              readOnly
              style={{ minHeight: '200px', whiteSpace: 'pre-wrap' }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LoremGenerator;
