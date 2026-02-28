# Chrome 65 Remake - Portable Static Build

The application is now configured to build as a **single, self-contained HTML file**.

## How to use:
1.  Run `npm run build`.
2.  The file `dist/index.html` is now a single file containing all scripts, styles, and assets.
3.  You can double-click `dist/index.html` to run it directly via the `file://` protocol.

## Download from the App:
You can also download the offline version directly from the running application:
1.  Open the browser menu (three dots).
2.  Click **"Download Browser (Offline)"**.
3.  This will download a single `.html` file that you can run anywhere without an internet connection.

## For Static Hosting (Vercel, Netlify, etc.):
1.  Set the build command to `npm run build`.
2.  Set the output directory to `dist`.
3.  The single `index.html` will be served.
