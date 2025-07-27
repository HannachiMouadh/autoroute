const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bucket = require("../firebaseUploadSingle"); // Your initialized Firebase bucket

const uploadSingle = express.Router(); // ✅ This is the correct variable

// Use memory storage for direct upload to Firebase
const upload = multer({ storage: multer.memoryStorage() });

// ✅ FIXED: use `uploadSingle.post(...)` instead of `router.post(...)`
uploadSingle.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const folder = "users";
    const filename = `${folder}/${Date.now()}-${req.file.originalname}`;
    const fileUpload = bucket.file(filename);

    await fileUpload.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      filename
    )}?alt=media`;

    res.status(200).json({ url: downloadUrl });
  } catch (err) {
    console.error("Single upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = uploadSingle;
