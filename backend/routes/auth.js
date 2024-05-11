import express from "express";
import { registerUser, loginUser, logout, forgotPassword, getUserProfile, updatePassword, updateProfile, allUser, getUserDetails, deleteUser, updateUser, uploadAvatar } from "../controllers/authControllers.js";
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth.js';


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

// Remove isAuthenticatedUser middleware from this route
router.route("/password/forgot").post(forgotPassword);

// Add isAuthenticatedUser middleware to protect this route
router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/upload_avatar").put(isAuthenticatedUser, uploadAvatar);


router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), allUser);
router.route("/admin/users/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);
router.route("/admin/users/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUser);
router.route("/admin/users/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
export default router;
