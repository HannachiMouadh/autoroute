const express = require("express");
const multer = require("multer");
const path = require("path");

const uploadRouter = express.Router();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

// Allow uploading up to 10 files with the form key "files"
uploadRouter.post("/", upload.array("files", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json(filePaths);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = uploadRouter;
