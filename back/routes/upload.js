const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bucket = require("../firebaseUpload"); // Adjusted path if firebase.js is in project root

const uploadRouter = express.Router();

// Use memory storage so we can send file buffers to Firebase
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload — handle multiple file uploads
uploadRouter.post("/", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    // Upload each file to Firebase Storage
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const filename = `${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(filename);

        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
            },
          },
        });

        // Construct Firebase public access URL
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
          filename
        )}?alt=media`;

        return downloadUrl;
      })
    );

    // Return array of public download URLs
    res.status(200).json(uploadedFiles);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = uploadRouter;
