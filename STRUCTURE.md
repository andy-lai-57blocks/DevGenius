# One Toys Project Structure

## Overview

This project has been reorganized to improve maintainability, with components grouped by categories and CSS split into modular files.

## Component Structure

```
src/
├── components/
│   ├── pages/              # Main category pages
│   │   ├── Home.js         # Home page
│   │   ├── Code.js         # Code tools category
│   │   ├── Office.js       # Office tools category
│   │   ├── TextTools.js    # Text tools category
│   │   ├── Info.js         # Info tools category
│   │   ├── DateTime.js     # Date/time tools category
│   │   └── index.js        # Barrel export
│   ├── tools/              # Individual tool components
│   │   ├── Base64Tool.js
│   │   ├── URLTool.js
│   │   ├── HTMLTool.js
│   │   ├── JSONFormatter.js
│   │   ├── XMLFormatter.js
│   │   ├── CaseConverter.js
│   │   ├── UUIDGenerator.js
│   │   ├── PasswordGenerator.js
│   │   ├── LoremGenerator.js
│   │   └── index.js        # Barrel export
│   ├── shared/             # Shared components
│   │   ├── GoogleAd.js
│   │   └── index.js        # Barrel export
│   └── legacy/             # Legacy category pages
│       ├── EncodersDecoders.js
│       ├── Formatters.js
│       ├── Generators.js
│       └── index.js        # Barrel export
└── styles/                 # Modular CSS files
    ├── common.css          # Global styles & layout
    ├── sidebar.css         # Navigation sidebar
    ├── forms.css           # Form elements & buttons
    ├── pages.css           # Page-specific styles
    ├── tools.css           # Tool components styles
    └── responsive.css      # Mobile & responsive styles
```

## CSS Organization

### common.css
- Global reset styles
- Main layout structure
- Content area styles
- Common animations

### sidebar.css
- Mobile header
- Sidebar navigation
- Collapsed states
- Menu hamburger animation

### forms.css
- Input fields styling
- Button components
- Form layouts
- Interactive states

### pages.css
- Home page hero section
- Category pages layout
- Card components
- Feature sections

### tools.css
- Individual tool styling
- Result displays
- Generator components
- Ad containers

### responsive.css
- Mobile breakpoints
- Tablet layouts
- Desktop optimizations
- Print styles

## Import Structure

Components are imported using barrel exports for cleaner code:

```javascript
// Clean imports
import { Home, Code, Office } from './components/pages';
import { Base64Tool, URLTool } from './components/tools';
import { GoogleAd } from './components/shared';
```

## Benefits

1. **Maintability**: Easier to find and modify specific components
2. **Modularity**: CSS is split into logical sections
3. **Scalability**: Easy to add new components to appropriate categories
4. **Clean Imports**: Barrel exports reduce import complexity
5. **Performance**: Better tree shaking and code splitting potential

## Development Workflow

- Add new tools to `src/components/tools/`
- Add new pages to `src/components/pages/`
- Update respective `index.js` files for barrel exports
- Add component-specific styles to appropriate CSS files
- Test responsive behavior across all breakpoints
