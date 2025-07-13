# Geometry Dash Enhanced Menu

A fast-loading Geometry Dash-style menu system built with React and optimized for instant performance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Visual Studio Code (recommended)

### Installation

1. **Clone or download this project**
2. **Open in Visual Studio Code**
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser to:** `http://localhost:5173`

## 🎮 Controls

- **Arrow Keys**: Navigate menus
- **Enter/Space**: Select options
- **Escape**: Go back to previous menu
- **WASD**: Alternative navigation keys

## 🏗️ Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/stores/     # State management
│   │   ├── styles/         # CSS styling
│   │   └── App.tsx         # Main app component
│   └── public/             # Static assets
├── server/                 # Express.js backend
└── package.json            # Dependencies
```

## 🛠️ VS Code Setup

### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

### Run Configuration
1. Open VS Code terminal (`Ctrl+``)
2. Run `npm run dev`
3. The app will automatically open in your browser

## 🎨 Features

- **Instant Loading**: No heavy 3D rendering, loads like original Geometry Dash
- **Keyboard Navigation**: Full arrow key support
- **Authentic Styling**: Neon buttons and Geometry Dash aesthetics
- **Level Selection**: Browse through classic GD levels
- **Settings Menu**: Audio and visual controls
- **Responsive Design**: Works on different screen sizes

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Customization
- Edit `client/src/styles/geometry-dash.css` for styling
- Modify `client/src/components/` for menu behavior
- Update `client/src/lib/stores/` for state management

## 📱 Performance

This menu is optimized for speed:
- Pure CSS animations instead of 3D rendering
- Minimal JavaScript for fast startup
- Efficient component structure
- No external 3D libraries

## 🎵 Audio

Place audio files in `client/public/sounds/`:
- `background.mp3` - Background music
- Add more sounds as needed

## 🚀 Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to any web hosting service
3. Enjoy your fast-loading Geometry Dash menu!

---

Built with ❤️ for the Geometry Dash community