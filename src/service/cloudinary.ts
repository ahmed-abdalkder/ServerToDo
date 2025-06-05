

// This component configures and initializes the Cloudinary SDK for uploading and managing media files.

import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
// Import Cloudinary v2 SDK and the ConfigOptions type for configuration

const configOptions: ConfigOptions = {
  cloud_name: process.env.CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUD_API_KEY, // API key from environment variables for security
  api_secret: process.env.CLOUD_API_SECRET, // API secret from environment variables for security
};

cloudinary.config(configOptions);
// Configure Cloudinary with the specified options

export default cloudinary;
// Export the configured Cloudinary instance for use in other parts of the application

