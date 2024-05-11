import express from "express";
const router = express.Router();

import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';

import { UpdateOrders, allOrders, deleteOrders, getOrderDetails, myOrders, newOrder } from "../controllers/orderControllers.js";

router.route("/orders/new").post(isAuthenticatedUser, newOrder); // Apply isAuthenticatedUser middleware
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser, myOrders);

router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.route("/admin/orders/:id").put(isAuthenticatedUser, authorizeRoles('admin'), UpdateOrders);
router.route("/admin/orders/:id").delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrders);

export default router;
