const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  bannerImg: {
    required: true,
    type: String,
  },
  images: [],
  price: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  reviews: [
    {
      ratings: {
        type: Number,
        required: true,
      },
      avgRatings: {
        type: Number,
        default: 0,
      },
      clientName: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  numOfReviews: {
    type: Number,
    required: true,
  },
  availabelColors: [String],
  brandName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  description: {
    text: {
      type: String,
      required: true,
    },
    additionalInfo: [],
  },

  size: {
    height: {
      type: String,
    },
    widht: {
      type: String,
    },
    weight: {
      type: String,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("productModel", productSchema);
