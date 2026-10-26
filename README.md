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
3. Start the server:

   ```bash
   node server.js
   ```

5. Open **http://localhost:3000** in your browser.


- The backend uses the `@imgly/background-removal-node` package to process images.
- Uploaded images are temporarily stored in `uploads/`; processed images are saved in `output/`.
- The server creates these folders automatically.
- Images are sent to your local Node.js server for processing; they are not processed entirely in the browser.

## Troubleshooting

- If `npm install` fails, check that Node.js 18 or newer is installed.
- If the page does not open, confirm the server is running and visit `http://localhost:3000`.
- If background removal fails, check the terminal for the server error message.

## License

Check the licenses of the project dependencies before distributing the application.
