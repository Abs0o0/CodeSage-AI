import multer from "multer";

const storage = multer.memoryStorage();

function imageFileFilter(req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP images are allowed."), false);
  }

  cb(null, true);
}

export const uploadAvatar = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single("avatar");