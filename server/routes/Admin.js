import express from "express";
import {
  AdminGetAllOrders,
  AdminLogin,
  AdminMe,
  AdminRegister,
  AdminUpdateOrderStatus,
} from "../controllers/Admin.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/signup", AdminRegister);
router.post("/signin", AdminLogin);
router.get("/me", verifyToken, AdminMe);

router.get("/orders", verifyAdmin, AdminGetAllOrders);
router.patch("/orders/:id/status", verifyAdmin, AdminUpdateOrderStatus);

export default router;

