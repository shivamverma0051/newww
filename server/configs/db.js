import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/greencart`);
    console.log("Database Connected:");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;
