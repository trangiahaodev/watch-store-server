import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Đăng nhập & Trả về Token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });
    }
  } catch (error) {
    console.log(`authUser in userController: `, error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Đăng ký user mới
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được sử dụng!" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.log(`registerUser in userController: `, error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Lấy thông tin profile của user đang đăng nhập
// @route   GET /api/users/profile
// @access  Private (Phải có Token mới gọi được)
const getUserProfile = async (req, res) => {
  try {
    // req.user được lấy từ Middleware authMiddleware.js
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
      });
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    console.log(`getUserProfile in userController: `, error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export { authUser, registerUser, getUserProfile };
