// ✅ userRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyPayment,
} from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/credits", userAuth, userCredits);
router.post("/pay-razor", userAuth, paymentRazorpay);
router.post("/verify-payment", userAuth, verifyPayment); // ✅ NEW

export default router;
