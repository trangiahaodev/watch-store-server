import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header Authorization có token và bắt đầu bằng "Bearer" không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Cắt chuỗi lấy cái token (Bearer sdasd.asdasd.asdasd)
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token để lấy ID user
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB và gán vào biến req.user (bỏ trường password ra)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Không có quyền truy cập, token không hợp lệ!" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "Không có quyền truy cập, không tìm thấy token!" });
  }
};

export { protect };
