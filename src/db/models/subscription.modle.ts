import mongoose, { Document, Schema, model } from "mongoose";

interface ISubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface ISubscription extends Document {
  endpoint: string;
  keys: ISubscriptionKeys;
  userId?: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const SubscriptionModel = model<ISubscription>("Subscription", SubscriptionSchema);

export default SubscriptionModel;

