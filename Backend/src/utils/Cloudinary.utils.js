import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { apiError } from "./ApiError.utils.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
//⁡⁣⁣⁢This here is to get the public Id that can be used to delete image from cloudinary⁡
function getPublicIdFromUrl(url) {
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  // Remove versioning and file extension from the second part
  let publicIdWithVersion = parts[1];

  // Remove the version (like v1681001234/)
  publicIdWithVersion = publicIdWithVersion.replace(/^v\d+\//, "");

  // Remove the file extension (.jpg, .png, etc)
  const publicId = publicIdWithVersion.replace(/\.[^/.]+$/, "");

  return publicId;
}
const deleteFromCloudinary = async (link) => {
  try {
    const publicId = getPublicIdFromUrl(link);
    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    throw new apiError(
      400,
      "Something went wrong while deleting the image from server"
    );
  }
};
export { uploadToCloudinary, deleteFromCloudinary };
