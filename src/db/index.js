import DB_NAME from "../constants.js";
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/${DB_NAME}`
    );
    console.log(`\n MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`\nError connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
