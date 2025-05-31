
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect ( process.env.DB_ONLINE as string);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Failed:", error instanceof Error ? error.message : error);
  }
};

export default connectDB;


 