const multer = require("multer");
const path = require("path");

// Set up storage configuration for Multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // specify where to save files
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).array("files"); // Allow multiple files in one upload

module.exports = upload;
