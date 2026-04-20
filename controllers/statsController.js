import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { isDelivered: true } }, // Chỉ tính tiền đơn đã hoàn tất
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments({ isAdmin: false });

    const last7Days = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
          isDelivered: true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        orderCount,
        productCount,
        userCount,
      },
      chartData: last7Days,
    });
  } catch (error) {
    console.log("getDashboardStats in statsController: ", error.message);
    res.status(500).json({ message: "Lỗi lấy data thống kê" });
  }
};
