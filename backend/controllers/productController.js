import Product from '../models/Product.js';

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 * @params  {
 *   name: string,
 *   description: string,
 *   price: number,
 *   category: string,
 *   stock: number,
 *   imageUrl: string
 * }
 */
export const createProduct = async (req, res) => {
  try {
    // Extract product details from request body
    const { name, description, price, category, stock, imageUrl } = req.body;

    // Create new product instance
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      imageUrl
    });

    // Return success response with created product
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 * @query   {
 *   keyword: string (search in name and description),
 *   category: string,
 *   minPrice: number,
 *   maxPrice: number,
 *   sortBy: string (price, createdAt),
 *   order: string (asc, desc),
 *   page: number,
 *   limit: number
 * }
 */
export const getProducts = async (req, res) => {
  try {
    const {
      keyword = '',
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Add keyword search
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      filter.category = category;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    // Execute query with filters, sorting, and pagination
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Return paginated response
    res.json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 * @params  id: Product ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update product details
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 * @params  id: Product ID
 * @body    Updated product fields
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product with new values
    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 * @params  id: Product ID
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
