import Product from "../models/Product.js";

// @desc    Lấy danh sách sản phẩm (Có Filter, Tìm kiếm, Phân trang)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const mongoQuery = {};
    const queryObj = { ...req.query };

    // 1. Loại bỏ các field dùng cho phân trang & sort
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. Xử lý thanh Tìm kiếm
    if (req.query.keyword) {
      mongoQuery.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { brand: { $regex: req.query.keyword, $options: "i" } },
        { modelCode: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    // 3. Xử lý lọc theo Giá
    if (req.query.minPrice || req.query.maxPrice) {
      mongoQuery.price = {};
      if (req.query.minPrice)
        mongoQuery.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        mongoQuery.price.$lte = Number(req.query.maxPrice);
    }

    // 4. BỘ LỌC ĐỘNG (DYNAMIC FILTERS)
    // 4A. Các field nằm ở cấp độ 1 của Schema (Basic fields)
    const basicFields = ["brand", "gender", "collectionName"];
    basicFields.forEach((field) => {
      if (req.query[field]) {
        mongoQuery[field] = { $regex: req.query[field], $options: "i" };
      }
    });

    // 4B. Các field nằm sâu bên trong object "specs" (Kỹ thuật, chất liệu...)
    // Chìa khóa ở đây là: Key của Frontend gửi lên -> Value là đường dẫn trong DB
    const specMapping = {
      glass: "specs.glass",
      movement: "specs.movement",
      caseMaterial: "specs.caseMaterial",
      style: "specs.style",
      special: "specs.specialFeatures",
      material: "specs.dialColor",
      type: "specs.movement",
    };

    Object.keys(specMapping).forEach((frontendKey) => {
      if (req.query[frontendKey]) {
        const dbPath = specMapping[frontendKey];
        mongoQuery[dbPath] = { $regex: req.query[frontendKey], $options: "i" };
      }
    });
    // =========================================================

    let query = Product.find(mongoQuery);

    // 5. Xử lý Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); // Mặc định Mới nhất
    }

    // 6. Xử lý Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // 7. Thực thi Query & Trả kết quả
    const products = await query;
    const total = await Product.countDocuments(mongoQuery);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    console.log(`getAllProducts in productController: `, error.message);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

// @desc    Lấy chi tiết 1 sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(400).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.log(`getProductById in productController: `, error.message);
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Không tìm thấy sản phẩm" });
    } else {
      res.status(500).json({ message: "Lỗi Server" });
    }
  }
};

// @desc    Lấy chi tiết 1 sản phẩm theo SLUG (Tối ưu SEO)
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(400).json({ message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.error(`getProductBySlug in productController: `, error.message);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

// @desc    Lấy Top 10 Đồng hồ Nam (Bán chạy / Nổi bật)
// @route   GET /api/products/top-men
// @access  Public
const getTopMenProducts = async (req, res) => {
  try {
    // Tạm thời lấy 10 sản phẩm Nam.
    // Nếu DB của ông có trường 'sold' (đã bán), có thể thêm .sort({ sold: -1 })
    const products = await Product.find({ gender: "Nam" });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi tải Đồng hồ Nam" });
  }
};

// @desc    Lấy Top 10 Đồng hồ Nữ
// @route   GET /api/products/top-women
// @access  Public
const getTopWomenProducts = async (req, res) => {
  try {
    const products = await Product.find({ gender: "Nữ" });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi tải Đồng hồ Nữ" });
  }
};

// @desc    Lấy 4 Mẫu đồng hồ mới nhất
// @route   GET /api/products/newest
// @access  Public
const getNewestProducts = async (req, res) => {
  try {
    // Sắp xếp theo _id hoặc createdAt giảm dần (-1) để lấy đồ mới nhất
    const products = await Product.find({}).sort({ _id: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi tải Hàng mới về" });
  }
};

export {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getTopMenProducts,
  getTopWomenProducts,
  getNewestProducts,
};
