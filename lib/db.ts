import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = 0; // Tracks connection status

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  if (mongoose.connection.readyState) {
    isConnected = mongoose.connection.readyState;
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);

    isConnected = db.connection.readyState;
    console.log(`MongoDB connected: ${db.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB.");
  }
};

export default connectToDatabase;
