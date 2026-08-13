const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, cloudinaryConfigured } = require("../config/cloudinary");

// Falls back to local disk storage under /uploads if Cloudinary isn't
// configured yet, so the feature still works out of the box for local dev.
const storage = cloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "hirehub/resumes",
        resource_type: "raw", // pdf/doc files
        allowed_formats: ["pdf", "doc", "docx"],
      },
    })
  : multer.diskStorage({
      destination: "uploads/",
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    });

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();
  if (!allowed.includes(ext)) return cb(new Error("Only PDF/DOC/DOCX resumes are allowed"));
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

module.exports = { upload, cloudinaryConfigured };
