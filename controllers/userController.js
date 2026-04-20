import User from "../models/User.js";
import Order from "../models/Order.js";
import generateToken from "../utils/generateToken.js";

// @desc Đăng nhập & Trả về Token
// @route POST /api/users/login
// @access Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Xác thực tài khoản còn hiệu lực và thông tin cá nhân
    if (user && (await user.matchPassword(password))) {
      if (user.isActive === false) {
        return res.status(403).json({
          message:
            "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ Admin!",
        });
      }

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

// @desc Đăng ký user mới
// @route POST /api/users
// @access Public
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

// @desc Lấy thông tin profile của user đang đăng nhập
// @route GET /api/users/profile
// @access Private (Phải có Token mới gọi được)
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

// @desc    Lấy danh sách tất cả Khách hàng (Dành cho trang AdminCustomerList)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    // Lấy tất cả user (trừ password ra)
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách khách hàng" });
  }
};

// @desc    Lấy chi tiết Khách hàng + Lịch sử đơn hàng
// @route   GET /api/users/:id/detail
// @access  Private/Admin
const getCustomerDetail = async (req, res) => {
  try {
    const [user, orders] = await Promise.all([
      User.findById(req.params.id).select("-password"),
      Order.find({ user: req.params.id }).sort("-createdAt"), // Lấy tất cả đơn, mới nhất lên đầu
    ]);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng này" });
    }

    // Tự động tính toán Tổng chi tiêu và Tổng số đơn trả về cho Frontend
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, order) => {
      // Chỉ cộng tiền những đơn đã thanh toán hoặc đã giao thành công
      if (order.isPaid || order.isDelivered) {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);

    res.status(200).json({
      user,
      metrics: {
        totalOrders,
        totalSpent,
      },
      recentOrders: orders,
    });
  } catch (error) {
    console.error("Lỗi getCustomerDetail: ", error);
    res.status(500).json({ message: "Lỗi Server khi lấy dữ liệu khách hàng" });
  }
};

// @desc    Khóa / Mở khóa tài khoản khách hàng
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        return res
          .status(400)
          .json({ message: "Không thể khóa tài khoản Admin!" });
      }

      user.isActive = !user.isActive;
      const updatedUser = await user.save();
      console.log("updatedUser: ", updatedUser);

      res.json({
        message: updatedUser.isActive
          ? "Đã mở khóa tài khoản"
          : "Đã khóa tài khoản",
        isActive: updatedUser.isActive,
      });
    } else {
      res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Cập nhật ghi chú nội bộ (Chỉ Admin thấy)
// @route   PUT /api/users/:id/note
// @access  Private/Admin
const updateAdminNote = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.adminNote = req.body.adminNote || "";
      await user.save();
      res.json({ message: "Đã lưu ghi chú", adminNote: user.adminNote });
    } else {
      res.status(404).json({ message: "Không tìm thấy khách hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Cập nhật thông tin cá nhân của User
// @route   PUT /api/users/profile
// @access  Private (Phải đăng nhập)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      // Xử lý cập nhật mật khẩu
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Lưu vào Database
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
        // Cấp lại token mới
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    console.log(`updateUserProfile in userController: `, error.message);
    res.status(500).json({ message: "Lỗi Server khi cập nhật hồ sơ" });
  }
};

export {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  getCustomerDetail,
  toggleUserStatus,
  updateAdminNote,
  updateUserProfile,
};
