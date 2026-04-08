import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    stock: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
