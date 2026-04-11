import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Middleware xác thực Token (Người dùng đã đăng nhập chưa?)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user và gán vào req.user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Người dùng không tồn tại!" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Không có quyền truy cập, token lỗi!" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có quyền truy cập, thiếu token!" });
  }
};

// 2. Middleware kiểm tra Quyền Admin (Người dùng có phải Admin không?)
const admin = (req, res, next) => {
  // Nếu req.user tồn tại (nhờ protect) và có role là "admin"
  if (req.user && req.user.isAdmin) {
    next(); // Cho phép đi tiếp vào controller
  } else {
    res.status(403).json({
      message: "Truy cập bị từ chối! Bạn không có quyền Admin.",
    });
  }
};

export { protect, admin };
