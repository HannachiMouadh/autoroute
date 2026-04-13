const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinaryConfig");
const User = require("../models/user");

const updatePhoto = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload buffer to Cloudinary
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

updatePhoto.post("/:userId", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const downloadUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    // Update user's image in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: downloadUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Photo updated successfully",
      imageUrl: downloadUrl,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update photo error:", err);
    res.status(500).json({ error: "Photo update failed" });
  }
});

module.exports = updatePhoto;
