import Product from "../models/Product.js";

// @desc    Lấy danh sách sản phẩm (Có Filter, Tìm kiếm, Phân trang)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const mongoQuery = {};

    // 1. Xu ly filter
    const queryObj = { ...req.query };
    // Cac field dac biet khong phai la tim kiem
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Xy ly tu khoa
    if (req.query.keyword) {
      queryObj.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { brand: { $regex: req.query.keyword, $options: "i" } },
        { modelCode: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    // Xu ly loc theo gia
    // URL: ?minPrice=2000000&maxPrice=10000000
    if (req.query.minPrice || req.query.maxPrice) {
      mongoQuery.price = {};
      if (req.query.minPrice) {
        mongoQuery.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        mongoQuery.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Xu ly loc theo thuong hieu, gioi tinh
    if (req.query.brand)
      mongoQuery.brand = { $regex: req.query.brand, $options: "i" };
    if (req.query.gender)
      mongoQuery.gender = { $regex: req.query.gender, $options: "i" };

    // Xu ly cac field nam trong specs: {}
    // URL: ?glass=Sapphire -> {"specs.glass": "Sapphire"}
    const specFields = ["glass", "movement", "strapMaterial", "caseMaterial"];
    specFields.forEach((field) => {
      if (req.query[field]) {
        mongoQuery[`specs.${field}`] = {
          $regex: req.query[field],
          $options: "i",
        };
        delete mongoQuery[field];
      }
    });

    let query = Product.find(mongoQuery);

    // 2. Xu ly sort
    // URL: ?sort=-price (giam dan), ?sort=price (tang dan)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3. Xu ly pagination
    // URL: ?page=2&limit=12
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Default 12 san pham/trang
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;
    // Dem tong so trang de tra ve Frontend
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
export const getTopMenProducts = async (req, res) => {
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
export const getTopWomenProducts = async (req, res) => {
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
export const getNewestProducts = async (req, res) => {
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
