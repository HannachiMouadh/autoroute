const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinaryConfig");

const uploadSingle = express.Router();

// Use memory storage for direct upload to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload a single buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "autoroute_users",
        resource_type: "auto",
        public_id: `${Date.now()}-${originalname.replace(/\.[^/.]+$/, "")}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// POST /api/uploadSingle — handle single file upload
uploadSingle.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const url = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    res.status(200).json({ url });
  } catch (err) {
    console.error("Single upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = uploadSingle;
