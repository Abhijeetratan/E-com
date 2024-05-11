import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from '../models/product.js';

import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFilter from "../utils/apiFilter.js";

// Get products => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res,next) => {
    try {
        const resPerPage = 4; // Number of products per page

        const apiFilter = new ApiFilter(Product.find(), req.query)
            .search()
            .filters()
            .pagination(resPerPage);

        const products = await apiFilter.query;
        
        const filteredProductsCount = await Product.countDocuments(apiFilter.querystr);

       //  return next (new ErrorHandler('Helllo',400))

        res.status(200).json({
            resPerPage,
            filteredProductsCount, // Corrected variable name
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Create new product => /api/v1/products
export const newProduct = catchAsyncErrors(async (req, res) => {

    req.body.user = req.user._id
    const product = await Product.create(req.body);
    console.log(product);
    res.status(201).json({
        product,
    });
});

// Get single product => /api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    console.log(product);
    res.status(200).json({
        product,
    });
});

// Update product details => /api/v1/products/:id
export const UpdateProduct = catchAsyncErrors(async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true });

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        console.log("Updated product details:", product);

        res.status(200).json({
            product,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

// Delete product details => /api/v1/products/:id
export const DeleteProduct = catchAsyncErrors(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        console.log("Existing product details:", product);

        await product.deleteOne(); // Use deleteOne() instead of delete()

        res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct: product,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

// ##### REVIEW #####

// Create/Update product review ==> /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body; // Extract rating, comment, and productId from request body

    // Validate productId
    if (!productId) {
        return next(new ErrorHandler("Product ID is required", 400));
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const review = {
            user: req.user._id, // Assuming user ID is already available in req.user
            rating: Number(rating), // Convert rating to a number
            comment,
        };

        const isReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((existingReview) => {
                if (existingReview.user.toString() === req.user._id.toString()) {
                    existingReview.comment = comment;
                    existingReview.rating = rating;
                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error", 500));
    }
});

// Get product reviews ==> /api/v1/reviews

export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews: product.reviews,
    });
});

// Delete product review => /api/v1/admin/reviews
export const DeleteReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.query.productId;

        // Retrieve the product
        const product = await Product.findById(productId);

        // Validate productId
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Filter out the review to be deleted
        const updatedReviews = product.reviews.filter(
            (review) => review._id.toString() !== req.query.id.toString()
        );

        // Update numOfReviews based on the filtered reviews
        const numOfReviews = updatedReviews.length;

        // Calculate the new rating based on updated reviews
        const newRating = numOfReviews === 0 ? 0 : updatedReviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

        // Update the product with the filtered reviews, numOfReviews, and new rating
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                reviews: updatedReviews,
                numOfReviews: numOfReviews,
                rating: newRating
            },
            { new: true }
        );

        // Sending a response indicating successful deletion
        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            product: updatedProduct // Optionally, you can send the updated product back
        });
    } catch (error) {
        next(error);
    }
});
