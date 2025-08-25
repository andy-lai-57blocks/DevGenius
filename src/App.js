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

// MREC Ad Component
const MRECAd = () => (
  <div className="ad-container">
    <div className="ad-placeholder">
      <span>Advertisement</span>
      <div className="ad-size">300 × 250</div>
    </div>
  </div>
);

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const menuItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/encoders', label: 'Encoders / Decoders' },
    { path: '/formatters', label: 'Formatters' },
    { path: '/generators', label: 'Generators' },
    { path: '/text', label: 'Text' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <h1>DevGenius</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="nav-links desktop-nav">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Mobile Navigation */}
        <ul className={`nav-links mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'active' : ''}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Main Layout Component
const Layout = ({ children }) => (
  <div className="app">
    <Navigation />
    <main className="main-content">
      <div className="content-container">
        {children}
        <MRECAd />
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
