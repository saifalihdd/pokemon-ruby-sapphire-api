import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB terhubung");
  } catch (error) {
    console.error("Gagal terhubung ke MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;