import express from "express";
import { submitContactQuery } from "../controllers/Contact.js";
import { getPublicRestaurants } from "../controllers/Restaurant.js";

const router = express.Router();

router.get("/restaurants", getPublicRestaurants);
router.post("/contact", submitContactQuery);

export default router;
