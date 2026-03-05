import Order from "../models/Order.js";

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private (Phải đăng nhập mới được mua)
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Kiểm tra xem giỏ hàng có rỗng không
    if (orderItems && orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào trong đơn hàng" });
    } else {
      // Tạo đơn hàng mới
      const order = new Order({
        orderItems,
        user: req.user._id, // Lấy ID user từ token đăng nhập
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      // Lưu vào Database
      const createdOrder = await order.save();
      console.log(`createdOrder: `, createdOrder);
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.log(`addOrderItems in orderController: `, error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Lấy chi tiết 1 đơn hàng theo ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    // Lấy order kèm theo thông tin (tên, email) của user tạo đơn đó
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (order) {
      // Bảo mật: Chỉ admin hoặc chủ nhân đơn hàng mới được xem
      if (
        req.user.isAdmin === "true" ||
        order.user._id.toString() === req.user._id.toString()
      ) {
        res.json(order);
      } else {
        res
          .status(403)
          .json({ message: "Bạn không có quyền xem đơn hàng này" });
      }
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    console.log(`getOrderById in orderController: `, error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Lấy danh sách đơn hàng của User đang đăng nhập (Lịch sử mua hàng)
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    console.log(`getMyOrders in orderController: `, error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export { addOrderItems, getOrderById, getMyOrders };
