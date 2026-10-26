# Background Remover

A simple web app that removes image backgrounds using JavaScript and Node.js.

## Features

- Upload or drag and drop an image
- Supports JPG, PNG, and WEBP
- Maximum upload size: 50 MB
- Preview the original and background-removed images
- Download the result as a PNG
- AI background removal powered by `@imgly/background-removal-node`

## Requirements

- Node.js 18 or newer
- npm

## Setup

1. Open a terminal in the project folder.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Make sure your project files are arranged like this:

   ```text
   background-remover/
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   └── app.js
   ├── server.js
   ├── package.json
   └── README.md
   ```

   Put the provided HTML, CSS, and JavaScript files inside `public/` and name them `index.html`, `style.css`, and `app.js`. Keep `server.js` and `package.json` in the project root.

4. Start the server:

   ```bash
   node server.js
   ```

5. Open **http://localhost:3000** in your browser.

## How to Use

1. Click **Choose Image** or drag an image into the upload area.
2. Wait for the background removal to finish.
3. Compare the original image with the result.
4. Click **Download PNG** to save the result.
5. Click **New Image** to process another image.

## Notes

- The backend uses the `@imgly/background-removal-node` package to process images.
- Uploaded images are temporarily stored in `uploads/`; processed images are saved in `output/`.
- The server creates these folders automatically.
- The first run may take longer while the AI model and required assets are loaded.
- Images are sent to your local Node.js server for processing; they are not processed entirely in the browser.

## Troubleshooting

- If `npm install` fails, check that Node.js 18 or newer is installed.
- If the page does not open, confirm the server is running and visit `http://localhost:3000`.
- If background removal fails, check the terminal for the server error message.

## License

Check the licenses of the project dependencies before distributing the application.
