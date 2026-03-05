import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 1. Đơn hàng này của ai? (Liên kết với bảng User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // 2. Mua những gì? (Mảng các sản phẩm)
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product", // Liên kết với bảng Product
        },
      },
    ],
    // 3. Giao đi đâu?
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    // 4. Thanh toán bằng gì? (VD: COD, VNPay, Momo)
    paymentMethod: {
      type: String,
      required: true,
      default: "COD",
    },
    // 5. Các loại phí
    itemsPrice: { type: Number, required: true, default: 0.0 }, // Tiền hàng
    shippingPrice: { type: Number, required: true, default: 0.0 }, // Phí ship
    totalPrice: { type: Number, required: true, default: 0.0 }, // Tổng cộng

    // 6. Trạng thái đơn hàng
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
