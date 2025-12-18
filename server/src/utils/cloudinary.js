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

        console.log("Uploading to Cloudinary...");

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Remove file from local server (fs) after upload to save space
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        console.error("❌ CLOUDINARY UPLOAD ERROR:", error);

        // Remove the local file if the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

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