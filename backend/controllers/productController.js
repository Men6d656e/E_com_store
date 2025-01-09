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
 *   stockQuantity: number,
 *   images: string[]
 * }
 */
export const createProduct = async (req, res) => {
  try {
    // Extract product details from request body
    const { 
      name, 
      description, 
      price, 
      category, 
      stockQuantity, 
      images 
    } = req.body;

    // Create new product instance
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stockQuantity,
      images
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
 *   page: number,
 *   limit: number
 * }
 */
export const getProducts = async (req, res) => {
  try {
    const { 
      keyword, 
      category, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 10 
    } = req.query;

    const queryConditions = {};

    // Keyword search
    if (keyword) {
      queryConditions.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      queryConditions.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      queryConditions.price = {};
      if (minPrice) queryConditions.price.$gte = Number(minPrice);
      if (maxPrice) queryConditions.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(queryConditions)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(queryConditions);

    res.status(200).json({
      success: true,
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
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

    res.status(200).json({
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
    const { 
      name, 
      description, 
      price, 
      category, 
      stockQuantity, 
      images 
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { 
        name, 
        description, 
        price, 
        category, 
        stockQuantity, 
        images,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
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
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 * @params  id: Product ID
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
