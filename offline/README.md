# Chrome 65 Remake - Offline Usage

This directory contains a single HTML file that loads the built scripts from the main project's `dist` directory.

## How to use:
1.  Run `npm run build` in the main project directory.
2.  Open `offline/index.html` in your browser.

## For Static Hosting (Vercel, Netlify, etc.):
1.  Connect your repository to your hosting provider.
2.  Set the build command to `npm run build`.
3.  Set the output directory to `dist`.

The application is configured with relative paths (`base: './'`), so it will work correctly on any static hosting platform or even when opened as a local file.
