import mongoose from "mongoose";
import seedSuperAdmin from "./seedAdmin.js";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await seedSuperAdmin();
    console.log("MongoDB is connected successfully...");
  } catch (error) {
    console.log(error);
    console.error("MongoDB Atlas connection is failed");
    process.exit(1);
  }
}
