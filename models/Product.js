import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    collectionName: {
      type: String,
    },
    modelCode: {
      type: String,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Nữ", "Unisex", "Cặp đôi", "Nam/Nữ"],
      default: "Nam",
    },
    origin: {
      type: String,
    },
    manufacturingPlace: {
      type: String,
    },
    specs: {
      glass: { type: String },
      movement: { type: String },
      warranty: { type: String },
      diameter: { type: Number },
      thickness: { type: Number },
      caseMaterial: { type: String },
      strapMaterial: { type: String },
      dialColor: { type: String },
      waterResistance: { type: String },
      lugToLug: { type: String },
      lugWidth: { type: String },
      style: { type: String },
      specialFeatures: { type: String },
      functions: [{ type: String }],
    },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

// Index text search cho tính năng tìm kiếm sau này
productSchema.index({ name: "text", brand: "text", modelCode: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
