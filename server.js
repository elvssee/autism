const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const uploadDir = path.join(__dirname, "recordings");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        cb(null, `recording-${timestamp}.webm`);
    },
});

const upload = multer({ storage });


app.post("/api/save-video", upload.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("✅ Video saved to:", req.file.path);
    return res.status(200).json({
        message: "Video saved successfully",
        filename: req.file.filename,
        path: req.file.path,
    });
});

app.listen(3003, () => {
    console.log("🚀 Server running on port 3003");
});
