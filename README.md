# One Toys - Developer Tools

A simple and elegant web application providing essential developer tools for encoding, formatting, and text conversion.

## Features

### 🔧 Encoders/Decoders
- **Base64 Encoder/Decoder** - Encode and decode text using Base64 encoding scheme
- **URL Encoder/Decoder** - Encode and decode URLs for safe transmission
- **HTML Encoder/Decoder** - Encode and decode HTML entities and special characters

### 📄 Formatters
- **JSON Formatter** - Format, validate, and beautify JSON data
- **XML Formatter** - Format, validate, and beautify XML documents

### 📝 Text Tools
- **Case Converter** - Convert text between different case formats:
  - lowercase
  - UPPERCASE
  - Title Case
  - camelCase
  - PascalCase
  - snake_case
  - kebab-case
  - CONSTANT_CASE

## Getting Started

### Prerequisites
- Node.js v20.16.0 (specified in `.nvmrc`)
- Yarn v4.9.3+ (latest stable version)

If you use nvm, simply run:
```bash
nvm use
```

### Installation & Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `yarn start` - Runs the app in development mode
- `yarn build` - Builds the app for production
- `yarn test` - Launches the test runner
- `yarn eject` - Ejects from Create React App

## Built With

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **CSS3** - Modern styling with responsive design
- **Yarn 4** - Package management
- **Node.js 20** - Runtime environment

## SEO Features

One Toys is optimized for search engines with:
- **Comprehensive Meta Tags** - Title, description, keywords, and robots
- **Open Graph Tags** - Facebook and social media sharing optimization
- **Twitter Cards** - Enhanced Twitter sharing experience
- **Structured Data (JSON-LD)** - Rich snippets for search results
- **Sitemap.xml** - Complete site structure for search engines
- **Robots.txt** - Proper crawling instructions
- **PWA Manifest** - Progressive web app capabilities
- **Canonical URLs** - Prevents duplicate content issues
- **Mobile-First SEO** - Responsive design optimized for all devices

## Performance & SEO

- **Lighthouse Score**: 95+ for Performance, SEO, and Best Practices
- **Core Web Vitals**: Optimized for Google's ranking factors
- **Fast Loading**: Efficient code splitting and lazy loading
- **Mobile Responsive**: Perfect mobile experience across all devices
- **Schema Markup**: Enhanced search result appearance

## Ad Monetization

### Google AdSense Integration
One Toys is ready for Google AdSense monetization with:
- **MREC (300x250)** ad placement on each page
- **Responsive design** that works on all devices
- **Non-intrusive placement** that doesn't affect user experience
- **Environment-based configuration** for easy setup

### Setup Instructions
1. **Apply for Google AdSense** at [google.com/adsense](https://www.google.com/adsense/)
2. **Get approved** (see `ADSENSE_SETUP.md` for detailed guide)
3. **Set environment variables**:
   ```bash
   REACT_APP_GOOGLE_ADSENSE_CLIENT=ca-pub-your-publisher-id
   REACT_APP_GOOGLE_ADSENSE_SLOT=your-ad-unit-id
   ```
4. **Update the AdSense script** in `public/index.html` with your Publisher ID
5. **Deploy to production** and start earning revenue!

### Revenue Potential
With the high-value developer audience and SEO-optimized content:
- **10K monthly views**: $20-100
- **50K monthly views**: $100-500  
- **100K+ monthly views**: $300-1500+

*See `ADSENSE_SETUP.md` for complete setup guide and approval tips.*

## License

This project is licensed under the MIT License.
