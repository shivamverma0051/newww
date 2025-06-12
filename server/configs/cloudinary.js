import { v2 as cloudinary } from "cloudinary";

// ✅ Cloudinary configuration (no need for async/await)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Export pre-configured instance
export default cloudinary;
