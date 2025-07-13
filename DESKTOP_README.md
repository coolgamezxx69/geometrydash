
# Geometry Dash Desktop Application

## Running in Development Mode

To run the desktop application in development mode:

```bash
npm run electron-dev
```

This will start both the server and the Electron application.

## Building for Windows

To build a Windows installer:

```bash
npm run build-desktop
```

This will create a Windows installer in the `electron/dist` folder.

## Manual Electron Setup

If you want to run Electron manually:

1. Start the server: `npm run dev`
2. In another terminal: `npm run electron`

## Requirements

- Node.js 18 or higher
- Windows 10 or higher (for Windows builds)

## Icon

Replace `client/public/icon.png` with your actual game icon (256x256 PNG recommended).
For Windows, also create `client/public/icon.ico` for the best results.
