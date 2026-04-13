const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinaryConfig");

const uploadRouter = express.Router();

// Use memory storage so we can send file buffers to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload a single buffer to Cloudinary and return the secure URL
const uploadToCloudinary = (fileBuffer, originalname) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "autoroute_uploads",
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

// POST /api/upload — handle multiple file uploads
uploadRouter.post("/", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    // Upload each file to Cloudinary
    const uploadedUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, file.originalname))
    );

    // Return array of Cloudinary URLs
    res.status(200).json(uploadedUrls);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = uploadRouter;
