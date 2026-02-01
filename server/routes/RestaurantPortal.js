import express from "express";
import { restaurantMe, restaurantSignIn } from "../controllers/RestaurantAuth.js";
import {
  restaurantCreateFood,
  restaurantDeleteFood,
  restaurantGetFoods,
  restaurantUpdateFood,
} from "../controllers/RestaurantFood.js";
import {
  restaurantGetOrders,
  restaurantUpdateOrderStatus,
} from "../controllers/RestaurantPortal.js";
import { verifyRestaurant } from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/signin", restaurantSignIn);
router.get("/me", verifyRestaurant, restaurantMe);

router.get("/orders", verifyRestaurant, restaurantGetOrders);
router.patch("/orders/:id/status", verifyRestaurant, restaurantUpdateOrderStatus);

router.get("/foods", verifyRestaurant, restaurantGetFoods);
router.post("/foods", verifyRestaurant, restaurantCreateFood);
router.patch("/foods/:id", verifyRestaurant, restaurantUpdateFood);
router.delete("/foods/:id", verifyRestaurant, restaurantDeleteFood);

export default router;

