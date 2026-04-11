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
        req.user.isAdmin ||
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

// @desc    Lấy tất cả đơn hàng (Dành cho Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    // Lấy tất cả đơn hàng, kèm thông tin user (tên, email), xếp mới nhất lên đầu
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    console.log(`getOrders in orderController: `, error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Cập nhật trạng thái: Đã thanh toán
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Cập nhật trạng thái: Đã giao hàng
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
};

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
};
