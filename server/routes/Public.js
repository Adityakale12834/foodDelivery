import express from "express";
import { getPublicRestaurants } from "../controllers/Restaurant.js";

const router = express.Router();

router.get("/restaurants", getPublicRestaurants);

export default router;
