import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },

    // Trạng thái hoạt động (Dùng cho nút KHÓA TÀI KHOẢN)
    // Mặc định tạo tài khoản xong là được hoạt động (true)
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },

    // Ghi chú nội bộ (Chỉ Admin mới được xem/sửa)
    adminNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// So sánh mật khẩu user nhập vào với mật khẩu đã mã hóa trong DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
