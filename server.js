const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
const OUTPUT_DIR = path.join(__dirname, "output");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = crypto.randomBytes(8).toString("hex");

        cb(null, `${name}${ext}`);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 50 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG and WEBP images are supported."));
        }

        cb(null, true);
    }
});

app.use(express.static(path.join(__dirname, "public")));


// --------------------------------------------------
// BACKGROUND REMOVAL
// --------------------------------------------------

app.post("/api/remove-background", upload.single("image"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: "No image was uploaded."
        });
    }

    const inputPath = req.file.path;

try {

    console.log("Processing:", req.file.originalname);

    // Read the Windows file path into a Buffer.
    // IMG.LY accepts Buffer/Uint8Array input.
    // ------------------------------------------
// Normalize input image to PNG
// ------------------------------------------

const imageBuffer =
    fs.readFileSync(inputPath);

console.log(
    "Original image:",
    imageBuffer.length,
    "bytes"
);


// Sharp converts JPG/WEBP/etc. into a
// standard PNG buffer before IMG.LY.

const normalizedBuffer =
    await sharp(imageBuffer)
        .png()
        .toBuffer();


console.log(
    "Normalized PNG:",
    normalizedBuffer.length,
    "bytes"
);


// ------------------------------------------
// Load IMG.LY
// ------------------------------------------

const {
    removeBackground
} =
    await import(
        "@imgly/background-removal-node"
    );

console.log(
    "IMG.LY loaded"
);


// ------------------------------------------
// Remove background
// ------------------------------------------

// ------------------------------------------
// Create PNG Blob with explicit MIME type
// ------------------------------------------

const normalizedBlob =
    new Blob(
        [normalizedBuffer],
        {
            type: "image/png"
        }
    );


console.log(
    "Normalized image type:",
    normalizedBlob.type
);


// ------------------------------------------
// Remove background
// ------------------------------------------

const blob =
    await removeBackground(
        normalizedBlob,
        {
            model: "medium",

            output: {
                format: "image/png",
                type: "foreground"
            }
        }
    );


console.log(
    "Background removal completed"
);

        const outputName =
            path.basename(req.file.filename, path.extname(req.file.filename))
            + "-no-background.png";

        const outputPath = path.join(OUTPUT_DIR, outputName);

        const buffer = Buffer.from(await blob.arrayBuffer());

        fs.writeFileSync(outputPath, buffer);

        console.log("Completed:", outputName);

        // Delete temporary uploaded file
        try {
            fs.unlinkSync(inputPath);
        } catch (e) {}

        res.json({
            success: true,
            originalName: req.file.originalname,
            filename: outputName,
            url: `/output/${outputName}`
        });

    } catch (error) {

    // ------------------------------------------
    // Safe error logging
    // ------------------------------------------

    let errorMessage = "Unknown error";
    let errorStack = "";

    try {
        errorMessage = String(
            error?.message || error
        );
    } catch (e) {
        errorMessage = "Unable to read error message.";
    }

    try {
        errorStack = String(
            error?.stack || ""
        );
    } catch (e) {
        errorStack = "";
    }

    console.error(
        "=========================================="
    );

    console.error(
        "BACKGROUND REMOVAL FAILED"
    );

    console.error(
        "Message:",
        errorMessage
    );

    if (errorStack) {
        console.error(
            "Stack:",
            errorStack
        );
    }

    console.error(
        "=========================================="
    );


    // Delete uploaded file

    try {

        fs.unlinkSync(
            inputPath
        );

    } catch (e) {}


    res.status(500).json({

        success: false,

        error:
            errorMessage ||
            "Background removal failed."

    });

}
});


// --------------------------------------------------
// SERVE OUTPUT FILES
// --------------------------------------------------

app.use(
    "/output",
    express.static(OUTPUT_DIR)
);


// --------------------------------------------------
// ERROR HANDLER
// --------------------------------------------------

app.use((err, req, res, next) => {

    console.error(err);

    res.status(400).json({
        success: false,
        error: err.message || "Something went wrong."
    });
});


// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
    console.log("");
    console.log("======================================");
    console.log("   BACKGROUND REMOVER");
    console.log("======================================");
    console.log("");
    console.log(`Running at: http://localhost:${PORT}`);
    console.log("");
});