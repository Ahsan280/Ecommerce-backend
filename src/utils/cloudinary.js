import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(LocalFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(LocalFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(LocalFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (cloudPath) => {
  try {
    if (!cloudPath) {
      return null;
    }
    const publicId = cloudPath.split("/")[7].split(".")[0];
    const response = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    return response;
  } catch (error) {
    return null;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
