// Upload file to Cloudinary (unsigned)
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
    
    console.log("Upload Preset:", uploadPreset);
    console.log("Cloud Name:", cloudName);
  
    // Validate environment variables
    if (!uploadPreset || !cloudName) {
      throw new Error("Missing required Cloudinary environment variables");
    }
  
    // Prepare the form data for the upload request
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset); // Use the unsigned upload preset
  
    // Debugging: Log form data contents
    console.log("FormData Contents:");
    formData.forEach((value, key) => console.log(`${key}: ${value}`));
  
    try {
      // Send the upload request
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      // Debugging: Log the response
      console.log("Response Status:", response.status);
  
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Cloudinary Error Response:", errorResponse);
        throw new Error(`File upload failed: ${errorResponse}`);
      }
  
      const data = await response.json();
      console.log("Upload Successful. Secure URL:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };