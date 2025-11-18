// backend/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  const allowed = /\.(jpeg|jpg|png|pdf)$/i;
  if (allowed.test(file.originalname)) cb(null, true);
  else cb(new Error("Unsupported file type. Allowed: jpg, jpeg, png, pdf"));
}

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
export default upload;
