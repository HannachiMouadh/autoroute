const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bucket = require("../firebaseUploadSingle");
const User = require("../models/user"); // adjust path to your User model

const updatePhoto = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

updatePhoto.post("/:userId", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Firebase
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
