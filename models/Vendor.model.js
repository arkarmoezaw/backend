import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shopName: String,
    isApproved: { type: Boolean, default: false },
    earnings: {
      available: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Vendor", vendorSchema);
