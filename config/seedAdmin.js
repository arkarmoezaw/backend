import User from "../models/User.model.js";

export default async function seedSuperAdmin() {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      console.log("🚀 No Admin found. Creating default Super Admin...");

      await User.create({
        username: "superadmin",
        email: "rkarmoezaw.dev@gmail.com",
        password: "rkar2004",
        role: "admin",
      });

      console.log("Super Admin created:");
    } else {
      console.log("Admin account already exists. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding Admin:", error);
  }
}
