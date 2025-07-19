import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to delete old profile image from Cloudinary
export const deleteOldProfileImage = async (imageUrl) => {
  if (!imageUrl || imageUrl.includes('avatars.githubusercontent.com')) {
    return; // Don't delete default GitHub avatars
  }
  
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1].split('.')[0];
    const publicId = `snippy-profiles/${filename}`;
    
    await cloudinary.v2.uploader.destroy(publicId);
    console.log("Old profile image deleted:", publicId);
  } catch (error) {
    console.error("Error deleting old profile image:", error);
  }
};

export default cloudinary; 