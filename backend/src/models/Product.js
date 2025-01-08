const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['electronics', 'clothing', 'books', 'home', 'sports'],
    },
    sizes: {
      type: [String],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: 0,
      default: 0,
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: String,
        images: [String],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate average rating before saving
productSchema.pre('save', function (next) {
  if (this.ratings.length > 0) {
    this.averageRating =
      this.ratings.reduce((acc, item) => item.rating + acc, 0) /
      this.ratings.length;
    this.numReviews = this.ratings.length;
  }
  next();
});

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

module.exports = mongoose.model('Product', productSchema);
