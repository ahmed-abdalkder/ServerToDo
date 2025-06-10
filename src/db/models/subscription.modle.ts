// This file defines the Mongoose schema and model for storing web push notification subscriptions.
// Each subscription includes an endpoint, encryption keys, an optional associated user, and timestamps.

import mongoose, { Document, Schema, model } from "mongoose"; 
// Import necessary modules from mongoose:
// - mongoose for working with MongoDB
// - Document interface to extend for TypeScript typing
// - Schema and model to define and create the Mongoose model

// Interface to define the structure of the subscription keys (p256dh and auth)
interface ISubscriptionKeys {
  p256dh: string; // Public key used in the push encryption
  auth: string;   // Authentication secret used in the push encryption
}

// Interface representing a subscription document in MongoDB
export interface ISubscription extends Document {
  endpoint: string;                  // Push service endpoint (unique identifier)
  keys: ISubscriptionKeys;          // Encryption keys for secure communication
  userId?: mongoose.Types.ObjectId; // Optional reference to the user who owns this subscription
  createdAt: Date;                  // Auto-generated timestamp when the document is created
  updatedAt: Date;                  // Auto-generated timestamp when the document is updated
}

// Define the Mongoose schema for subscriptions
const SubscriptionSchema = new Schema<ISubscription>({
  endpoint: { type: String, required: true }, // Endpoint must be required
  keys: {
    p256dh: { type: String, required: true }, // Required encryption public key
    auth: { type: String, required: true },   // Required authentication secret
  },
  userId: {
    type: Schema.Types.ObjectId, // Reference to a User document
    ref: "User",                 // Refers to the "User" model
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create the Mongoose model from the schema
const SubscriptionModel = model<ISubscription>("Subscription", SubscriptionSchema);

// Export the model for use in other parts of the application
export default SubscriptionModel;


