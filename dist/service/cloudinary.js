"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const configOptions = {
    cloud_name: 'dvxdj2ub8',
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
};
cloudinary_1.v2.config(configOptions);
exports.default = cloudinary_1.v2;
