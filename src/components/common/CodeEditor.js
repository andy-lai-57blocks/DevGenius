import React from 'react';
import AceEditor from 'react-ace';

// Import Ace Editor modes (languages)
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-text';

// Import Ace Editor themes
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

// Import Ace Editor extensions
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

// Configure Ace Editor to disable web workers (fixes worker loading issues in React)
import ace from 'ace-builds/src-noconflict/ace';
ace.config.set('useWorker', false);

/**
 * Get the consistent professional theme
 * Same beautiful appearance for all languages, but syntax highlighting will be language-specific
 */
const getTheme = (isDarkTheme) => {
  return isDarkTheme ? 'tomorrow_night' : 'github';
};

/**
 * Professional Code Editor Component using Ace Editor
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Editor content
 * @param {function} props.onChange - Change handler
 * @param {string} props.language - Programming language mode (json, xml, html, text)
 * @param {boolean} props.readOnly - Whether editor is read-only
 * @param {boolean} props.isDarkTheme - Dark theme toggle
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.name - Editor name/id
 * @param {number} props.fontSize - Font size (default: 14)
 * @param {boolean} props.showLineNumbers - Show line numbers (default: true)
 * @param {boolean} props.showGutter - Show gutter area (default: true)
 * @param {boolean} props.highlightActiveLine - Highlight active line (default: true)
 * @param {number} props.tabSize - Tab size (default: 2)
 */
const CodeEditor = ({
  value = '',
  onChange = () => {},
  language = 'text',
  readOnly = false,
  isDarkTheme = false,
  placeholder = '',
  name = 'code-editor',
  fontSize = 14,
  showLineNumbers = true,
  showGutter = true,
  highlightActiveLine = true,
  tabSize = 2,
  width = '100%',
  height = 'calc(100vh - 16rem)',
  ...props
}) => {
  // Map language names to Ace Editor modes
  const languageMap = {
    'json': 'json',
    'xml': 'xml',
    'html': 'html',
    'javascript': 'javascript',
    'js': 'javascript',
    'css': 'css',
    'text': 'text',
    'plain': 'text'
  };

  // Get the appropriate mode
  const mode = languageMap[language.toLowerCase()] || 'text';

  // Theme selection - consistent theme for all languages
  const theme = getTheme(isDarkTheme);

  // Editor options for professional IDE-like experience
  const editorOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: false,
    showLineNumbers: showLineNumbers,
    showGutter: showGutter,
    highlightActiveLine: highlightActiveLine,
    tabSize: tabSize,
    useSoftTabs: true,
    wrap: true,
    fontSize: fontSize,
    fontFamily: "'Source Code Pro', 'Monaco', 'Menlo', 'Courier New', monospace",
    cursorStyle: 'ace',
    mergeUndoDeltas: true,
    behavioursEnabled: true,
    wrapBehavioursEnabled: true,
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: false,
    scrollPastEnd: 0.1,
    fadeFoldWidgets: false,
    showInvisibles: false,
    displayIndentGuides: true,
    animatedScroll: true,
    scrollSpeed: 2,
    dragDelay: 0,
    dragEnabled: true,
    focusTimeout: 0,
    tooltipFollowsMouse: false,
    firstLineNumber: 1,
    overwrite: false,
    newLineMode: 'auto',
    useWorker: false,
    showFoldWidgets: true,
    foldStyle: 'markbegin',
    showPrintMargin: false,
    printMarginColumn: 80,
    highlightSelectedWord: true,
    fixedWidthGutter: false,
    theme: `ace/theme/${theme}`,
    mode: `ace/mode/${mode}`,
  };

  // Handle editor change
  const handleChange = (newValue, event) => {
    onChange(newValue);
  };

  // Handle editor load
  const handleEditorLoad = (editor) => {
    // Configure editor for better UX
    editor.setOptions(editorOptions);
    
    // Enable advanced features
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(tabSize);
    editor.getSession().setUseSoftTabs(true);
    
    // Placeholder is handled by AceEditor's native placeholder prop
    
    // Focus handling
    if (!readOnly) {
      setTimeout(() => {
        editor.focus();
      }, 100);
    }
  };

  return (
    <div className="code-editor-container" style={{ width, height }}>
      <AceEditor
        mode={mode}
        theme={theme}
        name={name}
        value={value}
        onChange={handleChange}
        onLoad={handleEditorLoad}
        width={width}
        height={height}
        readOnly={readOnly}
        placeholder={placeholder}
        fontSize={fontSize}
        showPrintMargin={false}
        showGutter={showGutter}
        highlightActiveLine={highlightActiveLine}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false, // Disabled to prevent interference
          enableSnippets: false,
          showLineNumbers: showLineNumbers,
          tabSize: tabSize,
          wrap: true,
          fontFamily: "'Source Code Pro', 'Monaco', 'Menlo', 'Courier New', monospace",
          useWorker: false // Disabled to prevent worker loading errors in React
        }}
        editorProps={{
          $blockScrolling: Infinity
        }}
        commands={[
          {
            name: 'save',
            bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
            exec: () => {
              // Prevent default save behavior
              return false;
            }
          }
        ]}
        {...props}
      />
      
      <style jsx>{`
        .code-editor-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid ${isDarkTheme ? '#334155' : '#e2e8f0'};
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, ${isDarkTheme ? '0.05' : '0.1'}),
            0 1px 3px rgba(0, 0, 0, ${isDarkTheme ? '0.4' : '0.1'}),
            0 1px 2px rgba(0, 0, 0, ${isDarkTheme ? '0.3' : '0.06'});
          transition: all 0.2s ease-in-out;
        }
        
        .code-editor-container:hover {
          border-color: ${isDarkTheme ? '#475569' : '#cbd5e0'};
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, ${isDarkTheme ? '0.08' : '0.1'}),
            0 4px 12px rgba(0, 0, 0, ${isDarkTheme ? '0.5' : '0.15'}),
            0 2px 4px rgba(0, 0, 0, ${isDarkTheme ? '0.3' : '0.08'});
          transform: translateY(-1px);
        }
        
        .code-editor-container :global(.ace_editor) {
          border-radius: 6px;
          font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Courier New', monospace !important;
        }
        
        .code-editor-container :global(.ace_gutter) {
          border-right: 1px solid ${isDarkTheme ? '#334155' : '#e2e8f0'};
          background: ${isDarkTheme 
            ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' 
            : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'};
        }
        
        .code-editor-container :global(.ace_gutter-active-line) {
          background: ${isDarkTheme ? '#334155' : '#dbeafe'};
        }
        
        .code-editor-container :global(.ace_active-line) {
          background: ${isDarkTheme ? 'rgba(51, 65, 85, 0.3)' : 'rgba(59, 130, 246, 0.1)'} !important;
        }
        
        .code-editor-container :global(.ace_selection) {
          background: ${isDarkTheme ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.25)'} !important;
        }
        
        .code-editor-container :global(.ace_cursor) {
          color: ${isDarkTheme ? '#60a5fa' : '#3b82f6'} !important;
        }
        
        .code-editor-container :global(.ace_scrollbar-h) {
          height: 12px !important;
        }
        
        .code-editor-container :global(.ace_scrollbar-v) {
          width: 12px !important;
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
