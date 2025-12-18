import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config"; // Ensure env vars are loaded

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // Sync delete is safer in serverless to ensure it happens before function exits
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary Error:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};
const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null;

        // Extract public_id from the URL
        // Logic: Splits URL by '/', takes the last part (filename.jpg), then splits by '.' to get ID
        const publicId = imageUrl.split("/").pop().split(".")[0];

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        console.log("Deleted from Cloudinary:", publicId);
        return result;

    } catch (error) {
        console.log("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };