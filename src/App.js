import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';

// Import styles
import './styles/main.scss';

// Import components
import { 
  Base64Tool, 
  URLTool, 
  HTMLTool, 
  JSONFormatter, 
  XMLFormatter,
  VASTFormatter,
  GzipTool,
  HLSTool,
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

import { GoogleAd, SEOHead, Breadcrumbs } from './components/shared';
import { AdProvider } from './contexts/AdContext';
import Ad from './components/ads/Ad';

// Legacy category imports for backward compatibility
// Legacy components removed - using category-based organization

// Sidebar Navigation Component
const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = React.useState({
    '/code': true,
    '/text': true,
    '/info': true,
    '/datetime': true
  });
  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠', exact: true },
    { 
      path: '/code', 
      label: 'Code', 
      icon: '🖥️',
      submenu: [
        { path: '/code/json', title: 'JSON Formatter', icon: '📋' },
        { path: '/code/xml', title: 'XML Formatter', icon: '📄' },
        { path: '/code/vast', title: 'VAST Formatter', icon: '📺' },
        { path: '/code/base64', title: 'Base64 Encoder/Decoder', icon: '🔐' },
        { path: '/code/url', title: 'URL Encoder/Decoder', icon: '🌐' },
        { path: '/code/html', title: 'HTML Encoder/Decoder', icon: '🏷️' },
        { path: '/code/gzip', title: 'Gzip Compression', icon: '🗜️' },
        { path: '/code/uuid', title: 'UUID Generator', icon: '🆔' },
        { path: '/code/password', title: 'Password Generator', icon: '🔑' },
        { path: '/code/hls', title: 'HLS Stream Player', icon: '📺' }
      ]
    },
    { 
      path: '/text', 
      label: 'Text', 
      icon: '🔤',
      submenu: [
        { path: '/text/case-converter', title: 'Case Converter', icon: '🔤' },
        { path: '/text/character-count', title: 'Character Count Tool', icon: '📊' },
        { path: '/text/lorem', title: 'Lorem Ipsum Generator', icon: '📝' }
      ]
    },
    { 
      path: '/info', 
      label: 'Info', 
      icon: 'ℹ️',
      submenu: [
        { path: '/info/system', title: 'System Information', icon: '💻' },
        { path: '/info/network', title: 'Network Information', icon: '🌐' },
        { path: '/info/browser', title: 'Browser Information', icon: '🌍' },
        { path: '/info/calling-codes', title: 'International Calling Codes', icon: '📞' },
        { path: '/info/public-services', title: 'Public Service Numbers', icon: '🚨' },
        { path: '/info/postcodes', title: 'Postcode Lookup', icon: '📮' }
      ]
    },
    { 
      path: '/datetime', 
      label: 'DateTime', 
      icon: '🕐',
      submenu: [
        { path: '/datetime/timestamp', title: 'Timestamp Converter', icon: '⏰' },
        { path: '/datetime/format', title: 'Date Formatter', icon: '📅' },
        { path: '/datetime/calculator', title: 'Date Calculator', icon: '🧮' },
        { path: '/datetime/timezone', title: 'Timezone Converter', icon: '🌍' },
        { path: '/datetime/countdown', title: 'Countdown Tool', icon: '⏱️' }
      ]
    }
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

  const toggleSubmenu = (menuPath) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [menuPath]: !prev[menuPath]
    }));
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
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              
              return (
                <li key={item.path} className={`nav-item ${hasSubmenu ? 'has-submenu' : ''}`}>
                  <div className="nav-link-container">
                    <Link 
                      to={item.path} 
                      className={`nav-link ${isActive ? 'active' : ''} ${hasSubmenu ? 'has-toggle' : ''}`}
                      onClick={closeMobileMenu}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span className="nav-text">{item.label}</span>
                          {/* Integrated Submenu Toggle */}
                          {hasSubmenu && (
                            <span
                              className={`submenu-toggle ${expandedSubmenus[item.path] ? 'expanded' : 'collapsed'}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSubmenu(item.path);
                              }}
                              aria-label={`Toggle ${item.label} submenu`}
                            >
                              <svg 
                                width="16" 
                                height="16" 
                                viewBox="0 0 16 16" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path 
                                  d="M4 6L8 10L12 6" 
                                  stroke="currentColor" 
                                  strokeWidth="1.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </div>
                  
                  {/* Submenu items - show when expanded and not collapsed */}
                  {hasSubmenu && !isCollapsed && expandedSubmenus[item.path] && (
                    <ul className="submenu">
                      {item.submenu.map((subitem) => {
                        const isSubitemActive = location.pathname === subitem.path;
                        return (
                          <li key={subitem.path}>
                            <Link
                              to={subitem.path}
                              className={`submenu-link ${isSubitemActive ? 'active' : ''}`}
                              onClick={closeMobileMenu}
                              title={subitem.title}
                            >
                              <span className="submenu-icon">{subitem.icon}</span>
                              <span className="submenu-text">{subitem.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
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
    <SEOHead />
    <Sidebar />
    <main className="main-content">
      <div className="content-container">
        <Ad type="banner" lazy={false} />
        <div className="content-area">
          <Breadcrumbs />
          {children}
        </div>

      </div>
    </main>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Analytics 
        debug={process.env.NODE_ENV === 'development'}
        beforeSend={(event) => {
          // Optional: Filter or modify events before sending
          return event;
        }}
      />
      <Router>
        <AdProvider>
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
          <Route path="/code/vast" element={<VASTFormatter />} />
          <Route path="/code/gzip" element={<GzipTool />} />
          <Route path="/code/hls" element={<HLSTool />} />
          
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
          
          {/* Legacy Category Pages - redirected to main Code page */}
          <Route path="/encoders" element={<Code />} />
          <Route path="/formatters" element={<Code />} />
          <Route path="/generators" element={<Code />} />
          
          {/* Legacy Tool Routes for backward compatibility */}
          <Route path="/encoders/base64" element={<Base64Tool />} />
          <Route path="/encoders/url" element={<URLTool />} />
          <Route path="/encoders/html" element={<HTMLTool />} />
          <Route path="/formatters/json" element={<JSONFormatter />} />
          <Route path="/formatters/xml" element={<XMLFormatter />} />
          <Route path="/formatters/vast" element={<VASTFormatter />} />
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
        </AdProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
