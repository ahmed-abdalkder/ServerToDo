

import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

const configOptions: ConfigOptions = {
  cloud_name: 'dvxdj2ub8',
  api_key: process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET ,
};

cloudinary.config(configOptions);
 
export default cloudinary;
