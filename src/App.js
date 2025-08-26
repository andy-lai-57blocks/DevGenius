import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Import styles
import './styles/common.css';
import './styles/sidebar.css';
import './styles/forms.css';
import './styles/pages.css';
import './styles/tools.css';
import './styles/responsive.css';

// Import components
import { 
  Base64Tool, 
  URLTool, 
  HTMLTool, 
  JSONFormatter, 
  XMLFormatter, 
  CaseConverter, 
  CharacterCount,
  UUIDGenerator, 
  PasswordGenerator, 
  LoremGenerator,
  SystemInfo,
  NetworkInfo,
  BrowserInfo,
  CallingCodesLookup,
  PublicServiceNumbers,
  PostcodeLookup,
  TimestampConverter,
  DateFormatter,
  DateCalculator,
  TimezoneConverter,
  CountdownTool
} from './components/tools';

import { 
  Home, 
  Code, 
  Office, 
  TextTools, 
  Info, 
  DateTime 
} from './components/pages';

import { GoogleAd } from './components/shared';

// Legacy category imports for backward compatibility
import { 
  EncodersDecoders, 
  Formatters, 
  Generators 
} from './components/legacy';

// Sidebar Navigation Component
const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  
  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠', exact: true },
    { path: '/code', label: 'Code', icon: '🖥️' },
    { path: '/text', label: 'Text', icon: '🔤' },
    { path: '/info', label: 'Info', icon: 'ℹ️' },
    { path: '/datetime', label: 'DateTime', icon: '🕐' }
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
          
          {/* New Category Pages */}
          <Route path="/code" element={<Code />} />
          <Route path="/text" element={<TextTools />} />
          <Route path="/info" element={<Info />} />
          <Route path="/datetime" element={<DateTime />} />
          
          {/* Office redirect page for backward compatibility */}
          <Route path="/office" element={<Office />} />
          
          {/* Code Tools (Encoders/Decoders & Formatters) */}
          <Route path="/code/base64" element={<Base64Tool />} />
          <Route path="/code/url" element={<URLTool />} />
          <Route path="/code/html" element={<HTMLTool />} />
          <Route path="/code/json" element={<JSONFormatter />} />
          <Route path="/code/xml" element={<XMLFormatter />} />
          
          {/* Code Tools (Generators) */}
          <Route path="/code/uuid" element={<UUIDGenerator />} />
          <Route path="/code/password" element={<PasswordGenerator />} />
          
          {/* Text Tools */}
          <Route path="/text/case-converter" element={<CaseConverter />} />
          <Route path="/text/character-count" element={<CharacterCount />} />
          <Route path="/text/lorem" element={<LoremGenerator />} />
                
                {/* Info Tools */}
                <Route path="/info/system" element={<SystemInfo />} />
                <Route path="/info/network" element={<NetworkInfo />} />
                <Route path="/info/browser" element={<BrowserInfo />} />
                <Route path="/info/calling-codes" element={<CallingCodesLookup />} />
                <Route path="/info/public-services" element={<PublicServiceNumbers />} />
                <Route path="/info/postcodes" element={<PostcodeLookup />} />
                
                {/* DateTime Tools */}
                <Route path="/datetime/timestamp" element={<TimestampConverter />} />
                <Route path="/datetime/format" element={<DateFormatter />} />
                <Route path="/datetime/calculator" element={<DateCalculator />} />
                <Route path="/datetime/timezone" element={<TimezoneConverter />} />
                <Route path="/datetime/countdown" element={<CountdownTool />} />
          
          {/* Legacy Category Pages for backward compatibility */}
          <Route path="/encoders" element={<EncodersDecoders />} />
          <Route path="/formatters" element={<Formatters />} />
          <Route path="/generators" element={<Generators />} />
          
          {/* Legacy Tool Routes for backward compatibility */}
          <Route path="/encoders/base64" element={<Base64Tool />} />
          <Route path="/encoders/url" element={<URLTool />} />
          <Route path="/encoders/html" element={<HTMLTool />} />
          <Route path="/formatters/json" element={<JSONFormatter />} />
          <Route path="/formatters/xml" element={<XMLFormatter />} />
          <Route path="/generators/uuid" element={<UUIDGenerator />} />
          <Route path="/generators/password" element={<PasswordGenerator />} />
          <Route path="/generators/lorem" element={<LoremGenerator />} />
          {/* Office backward compatibility routes */}
          <Route path="/office/uuid" element={<UUIDGenerator />} />
          <Route path="/office/password" element={<PasswordGenerator />} />
          <Route path="/office/lorem" element={<LoremGenerator />} />
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
