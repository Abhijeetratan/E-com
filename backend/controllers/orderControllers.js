import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from '../utils/ErrorHandler.js';
import Order from "../models/order.js";
import Product from "../models/product.js";
import order from "../models/order.js";

export const newOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        console.log('Request Body:', req.body); // Log the entire request body

        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
            orderStatus
        } = req.body;

        // Check if shippingInfo is provided and if shipping country is missing
        if (!shippingInfo || !shippingInfo.country) {
            return res.status(400).json({
                success: false,
                error: "Shipping country is required"
            });
        }

        // Check if order status is valid
        const validStatuses = ["Processing", "Shipping", "Delivered"];
        if (!validStatuses.includes(orderStatus)) {
            console.log('Invalid order status:', orderStatus);
            return res.status(400).json({
                success: false,
                error: "Invalid order status. Please select one of: Processing, Shipping, Delivered"
            });
        }

        // Create new order
        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
            orderStatus,
            user: req.user._id,
        });
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating new order:', error);
        return next(new ErrorHandler('Failed to create new order', 500));
    }
});

// Get  current  user orders => http://localhost:5000/api/v1/orders/myorders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id });


    res.status(200).json({
        order,
    });
})

// Get order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(req.params._id).populate("user", "name email",);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: "No order found with this ID"
            });
        }

        res.status(200).json({
            success: true,
            order: order
        });
    } catch (error) {
        return next(new ErrorHandler("Error retrieving order details", 500));
    }
});

// Get all orders --- ADMIN => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();


    res.status(200).json({
        orders,
    });
})

// Update order --- ADMIN => /api/v1/admin/orders/:id
export const UpdateOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("No Order Found With This ID", 404));
    }

    if (!order?.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have all ready delivered  this order", 400));
    }

    // Update products stock
    order?.orderItems?.forEach(async (items) => {
        const product = await Product.findById(item?.product?.toString());
        if (!product) {
            return next(new ErrorHandler("No Product found with this ID", 404));
        }
        product.stock = product.stock - quantity;
        await product.save();
    });
    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    res.status(200).json({
        success: true,
    });
})

// Delete order --- ADMIN => /api/v1/admin/orders/:id
export const deleteOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);


    if (!orders) {
        return next(new ErrorHandler("No Order Found with thid ID ", 404))
    }
    await order.deleteOne();

    res.status(200).json({
        success: true
    });
})