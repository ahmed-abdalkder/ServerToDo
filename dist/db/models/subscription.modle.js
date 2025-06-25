"use strict";
// This file defines the Mongoose schema and model for storing web push notification subscriptions.
// Each subscription includes an endpoint, encryption keys, an optional associated user, and timestamps.
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Mongoose schema for subscriptions
const SubscriptionSchema = new mongoose_1.Schema({
    endpoint: { type: String, required: true, unique: true }, // Endpoint must be required
    keys: {
        p256dh: { type: String, required: true }, // Required encryption public key
        auth: { type: String, required: true }, // Required authentication secret
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, // Reference to a User document
        ref: "User", // Refers to the "User" model
    },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields
// Create the Mongoose model from the schema
const SubscriptionModel = (0, mongoose_1.model)("Subscription", SubscriptionSchema);
// Export the model for use in other parts of the application
exports.default = SubscriptionModel;
