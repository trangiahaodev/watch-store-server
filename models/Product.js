import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // VD: Titoni Airmaster 83743 S-682
    slug: {
      type: String,
      unique: true,
    }, // VD: titoni-airmaster-83743 (Để làm URL đẹp)
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
    // PHÂN LOẠI & LỌC (Dùng để Filter bên sidebar) ---
    brand: {
      type: String,
      required: true,
    }, // Thương hiệu: Titoni
    collectionName: {
      type: String,
    }, // Bộ sưu tập: Titoni Airmaster
    modelCode: {
      type: String,
      unique: true,
    }, // Số hiệu sản phẩm: 83743 S-682
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Unisex", "Cặp đôi"],
      default: "Nam",
    },
    origin: {
      type: String,
    },
    specs: {
      // Kính: Sapphire (Có phủ chống chói)
      glass: { type: String },
      // Máy: Automatic (Máy SW200-1...)
      movement: { type: String },
      // Bảo hành: Lưu chuỗi "2 năm quốc tế" hoặc số năm
      warranty: { type: String },
      // Đường kính mặt số: 39 mm (Lưu số để sau này lọc khoảng size)
      diameter: { type: Number },
      // Bề dày mặt số
      thickness: { type: Number },
      // Niềng (Vỏ): Thép không gỉ
      caseMaterial: { type: String },
      // Dây đeo: Thép không gỉ
      strapMaterial: { type: String },
      // Màu mặt số: Xanh đính đá
      dialColor: { type: String },
      // Chống nước: 5 ATM
      waterResistance: { type: String },
      // Chức năng: Lịch ngày
      functions: [{ type: String }],
    },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

// Tạo index text để sau này làm chức năng tìm kiếm
productSchema.index({ name: "text", brand: "text", modelCode: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
