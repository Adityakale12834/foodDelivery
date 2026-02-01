import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";
import RestaurantUser from "../models/RestaurantUser.js";

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(createError(401, "You are not authenticated!"));
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(createError(401, "You are not authenticated!"));
    const decode = jwt.verify(token, process.env.JWT);
    req.user = decode;
    return next();
  } catch (err) {
    next(err);
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    await verifyToken(req, res, async (err) => {
      if (err) return next(err);
      const user = await User.findById(req.user?.id).select("role").exec();
      if (!user) return next(createError(401, "You are not authenticated!"));
      if (user.role !== "admin") return next(createError(403, "Admin only"));
      return next();
    });
  } catch (err) {
    next(err);
  }
};

export const verifyRestaurant = async (req, res, next) => {
  try {
    await verifyToken(req, res, async (err) => {
      if (err) return next(err);
      if (req.user?.type !== "restaurant") {
        return next(createError(403, "Restaurant only"));
      }
      const ru = await RestaurantUser.findById(req.user?.id)
        .select("restaurant")
        .exec();
      if (!ru) return next(createError(401, "You are not authenticated!"));
      req.restaurantUser = { id: ru._id };
      req.restaurantId = ru.restaurant?.toString();
      return next();
    });
  } catch (err) {
    next(err);
  }
};
