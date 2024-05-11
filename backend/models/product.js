import mongoose from "mongoose";

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        max: [99999, "Product price cannot exceed 99999"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    rating: {
        type: Number,
        default: 0,
    },
    images: [{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    }],
    category: {
        type: String,
        required: [true, 'Please enter product category'],
        enum: {
            values: ['Electronics', 'Headphones', 'Accessories', 'Cameras', 'Laptops', 'Food'],
            message: 'Please select correct Category',
        },
    },
    seller: {
        type: String,
        required: [true, "Please enter seller name"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

// Check if the model is already defined to prevent OverwriteModelError
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;