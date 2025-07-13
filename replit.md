# Geometry Dash Enhanced Menu

## Overview

This is a high-performance Geometry Dash-style menu system optimized for instant loading like the original game. The application features a React frontend with pure CSS animations (no 3D rendering) and an Express.js backend with PostgreSQL database integration. The project is built with TypeScript and uses modern development tools for a seamless development experience.

## Recent Changes (January 2025)

**Performance Optimization for Instant Loading:**
- Completely removed React Three.js dependencies that were causing slow loading times
- Converted all 3D menu components to pure CSS with animated backgrounds
- Added geometric particle animations using CSS gradients instead of heavy 3D rendering
- Maintained authentic Geometry Dash styling with neon buttons and effects
- Preserved all keyboard navigation (arrow keys, Enter, Escape)
- Created smooth loading animations for game screen transitions

**Technical Migration:**
- Replaced `@react-three/fiber` Canvas with standard HTML/CSS layout
- Removed `@react-three/drei` dependencies from all menu components
- Converted 3D mesh backgrounds to CSS gradient animations
- Implemented CSS-only particle system for visual appeal
- Added VS Code configuration files for better development experience

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Graphics**: React Three Fiber (@react-three/fiber) with Three.js for 3D rendering
- **UI Components**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom CSS for game-specific styles
- **State Management**: Zustand for client-side state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **API Design**: RESTful API structure (routes currently minimal)

### Key Design Decisions

**Frontend Choice**: React Three Fiber was chosen for its declarative approach to 3D graphics, making complex animations and interactive 3D menus easier to manage than traditional WebGL or Canvas approaches.

**State Management**: Zustand provides a lightweight alternative to Redux, suitable for the game's simple state requirements (menu navigation, audio controls, game phase).

**UI Component Library**: Radix UI offers accessible, unstyled components that can be customized to match the neon-themed Geometry Dash aesthetic.

**Database Setup**: Drizzle ORM with PostgreSQL provides type safety and excellent TypeScript integration, though the current schema is minimal (only users table).

## Key Components

### Menu System
- **MainMenu**: Main entry point with animated title and navigation buttons
- **LevelSelection**: Grid-based level browser with difficulty indicators
- **Settings**: Configuration panel for audio and visual settings
- **NeonButton**: Reusable styled button component with glow effects

### 3D Graphics
- **ParticleBackground**: Animated particle system for visual appeal
- **GeometryDashMenu**: Main 3D scene coordinator with gentle rotation animations
- **Canvas Setup**: Optimized Three.js scene with appropriate lighting and camera positioning

### State Stores
- **useMenu**: Manages current screen navigation and menu state
- **useAudio**: Controls background music, sound effects, and mute functionality
- **useGame**: Handles game phase transitions (ready, playing, ended)

### UI Infrastructure
- **Comprehensive Component Library**: Full set of Radix UI components (buttons, dialogs, forms, etc.)
- **Responsive Design**: Mobile-friendly layouts with touch support
- **Accessibility**: Built-in keyboard navigation and screen reader support

## Data Flow

### Menu Navigation
1. User input triggers state changes in useMenu store
2. Menu components react to state changes and update 3D scene
3. Keyboard controls provide alternative navigation method
4. Screen transitions are managed centrally through the menu store

### Audio System
1. Audio files are loaded and stored in useAudio store
2. User interactions trigger audio playback (if not muted)
3. Background music loops continuously when unmuted
4. Sound effects play on user actions and game events

### Game State
1. Game phases controlled through useGame store
2. Phase transitions trigger UI updates and audio changes
3. Restart functionality resets all game state to initial values

## External Dependencies

### Core Framework Dependencies
- **React Three.js Ecosystem**: @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **UI Components**: @radix-ui/* components for accessible interface elements
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **Styling**: Tailwind CSS with PostCSS for styling pipeline

### Development Tools
- **Build Tools**: Vite with React plugin and GLSL shader support
- **Database Tools**: Drizzle Kit for schema management and migrations
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Production bundling for server-side code

### Audio and Assets
- **Font Loading**: @fontsource/inter for consistent typography
- **Asset Support**: GLSL shaders, 3D models (GLTF/GLB), and audio files
- **Graphics**: Support for various image and audio formats

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with HMR for rapid development
- **TypeScript Checking**: Continuous type checking during development
- **Database Migrations**: Drizzle Kit for schema versioning

### Production Build
- **Frontend**: Vite builds optimized static assets to dist/public
- **Backend**: ESBuild bundles server code to dist/index.js
- **Database**: PostgreSQL connection via environment variable (DATABASE_URL)

### Environment Configuration
- **Database**: Requires DATABASE_URL environment variable for PostgreSQL connection
- **Static Assets**: Frontend assets served from dist/public in production
- **Node.js**: Production server runs compiled JavaScript with ES module support

### Scaling Considerations
- **Database**: Using Neon serverless PostgreSQL for automatic scaling
- **Static Assets**: Frontend can be served via CDN for better performance
- **Server**: Express.js backend can be horizontally scaled as needed