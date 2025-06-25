"use strict";
// This component configures and initializes the Cloudinary SDK for uploading and managing media files.
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Import Cloudinary v2 SDK and the ConfigOptions type for configuration
const configOptions = {
    cloud_name: process.env.CLOUD_NAME, // Your Cloudinary cloud name
    api_key: process.env.CLOUD_API_KEY, // API key from environment variables for security
    api_secret: process.env.CLOUD_API_SECRET, // API secret from environment variables for security
};
cloudinary_1.v2.config(configOptions);
// Configure Cloudinary with the specified options
exports.default = cloudinary_1.v2;
// Export the configured Cloudinary instance for use in other parts of the application
