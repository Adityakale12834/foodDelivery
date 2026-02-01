import express from "express";
import {
  adminCreateRestaurant,
  adminDeleteRestaurant,
  adminGetRestaurantById,
  adminGetRestaurants,
  adminUpdateRestaurant,
} from "../controllers/Restaurant.js";
import { adminUpsertRestaurantAccount } from "../controllers/RestaurantAuth.js";
import { verifyAdmin } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/", verifyAdmin, adminGetRestaurants);
router.post("/", verifyAdmin, adminCreateRestaurant);
router.post("/:id/account", verifyAdmin, adminUpsertRestaurantAccount);
router.get("/:id", verifyAdmin, adminGetRestaurantById);
router.patch("/:id", verifyAdmin, adminUpdateRestaurant);
router.delete("/:id", verifyAdmin, adminDeleteRestaurant);

export default router;

