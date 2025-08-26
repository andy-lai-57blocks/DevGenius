import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Import components
import Base64Tool from './components/Base64Tool';
import URLTool from './components/URLTool';
import HTMLTool from './components/HTMLTool';
import JSONFormatter from './components/JSONFormatter';
import XMLFormatter from './components/XMLFormatter';
import CaseConverter from './components/CaseConverter';
import UUIDGenerator from './components/UUIDGenerator';
import PasswordGenerator from './components/PasswordGenerator';
import LoremGenerator from './components/LoremGenerator';
import Home from './components/Home';

// Import category pages
import EncodersDecoders from './components/EncodersDecoders';
import Formatters from './components/Formatters';
import Generators from './components/Generators';
import TextTools from './components/TextTools';
import GoogleAd from './components/GoogleAd';

// Sidebar Navigation Component
const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  
  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠', exact: true },
    { path: '/encoders', label: 'Encoders / Decoders', icon: '🔐' },
    { path: '/formatters', label: 'Formatters', icon: '📋' },
    { path: '/generators', label: 'Generators', icon: '🆔' },
    { path: '/text', label: 'Text Tools', icon: '🔤' }
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <Link to="/" className="mobile-logo" onClick={closeMobileMenu}>
          <h1>One Toys</h1>
        </Link>
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={closeMobileMenu}>
            <div className="logo-icon">🧠</div>
            {!isCollapsed && <span className="logo-text">One Toys</span>}
          </Link>
          
          {/* Desktop Collapse Toggle */}
          <button 
            className="collapse-toggle desktop-only"
            onClick={toggleCollapse}
            aria-label="Toggle sidebar"
          >
            <span className={`toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>‹</span>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-links">
            {menuItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && <span className="nav-text">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

// Main Layout Component
const Layout = ({ children }) => (
  <div className="app">
    <Sidebar />
    <main className="main-content">
      <div className="content-container">
        <div className="content-area">
          {children}
        </div>
        <GoogleAd 
          width={300}
          height={250}
          adFormat="rectangle"
          className="mrec-ad"
        />
      </div>
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          
          {/* Category Pages */}
          <Route path="/encoders" element={<EncodersDecoders />} />
          <Route path="/formatters" element={<Formatters />} />
          <Route path="/generators" element={<Generators />} />
          <Route path="/text" element={<TextTools />} />
          
          {/* Encoder/Decoder Tools */}
          <Route path="/encoders/base64" element={<Base64Tool />} />
          <Route path="/encoders/url" element={<URLTool />} />
          <Route path="/encoders/html" element={<HTMLTool />} />
          
          {/* Formatter Tools */}
          <Route path="/formatters/json" element={<JSONFormatter />} />
          <Route path="/formatters/xml" element={<XMLFormatter />} />
          
          {/* Generator Tools */}
          <Route path="/generators/uuid" element={<UUIDGenerator />} />
          <Route path="/generators/password" element={<PasswordGenerator />} />
          <Route path="/generators/lorem" element={<LoremGenerator />} />
          
          {/* Text Tools */}
          <Route path="/text/case-converter" element={<CaseConverter />} />
          
          {/* Legacy redirects for backward compatibility */}
          <Route path="/base64" element={<Base64Tool />} />
          <Route path="/url" element={<URLTool />} />
          <Route path="/html" element={<HTMLTool />} />
          <Route path="/json" element={<JSONFormatter />} />
          <Route path="/xml" element={<XMLFormatter />} />
          <Route path="/case" element={<CaseConverter />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
