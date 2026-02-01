import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import RestaurantUser from "../models/RestaurantUser.js";
import Restaurant from "../models/Restaurant.js";

export const restaurantSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await RestaurantUser.findOne({ email: String(email || "").toLowerCase() })
      .populate("restaurant")
      .exec();
    if (!user) return next(createError(409, "Account not found."));

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return next(createError(403, "Incorrect password"));

    const token = jwt.sign(
      { id: user._id, type: "restaurant", restaurantId: user.restaurant?._id },
      process.env.JWT,
      { expiresIn: "9999 years" }
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "restaurant",
        restaurant: user.restaurant,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const restaurantMe = async (req, res, next) => {
  try {
    const user = await RestaurantUser.findById(req.restaurantUser?.id)
      .populate("restaurant")
      .exec();
    if (!user) return next(createError(401, "You are not authenticated!"));
    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "restaurant",
        restaurant: user.restaurant,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Admin utility: create/reset a restaurant login
export const adminUpsertRestaurantAccount = async (req, res, next) => {
  try {
    const { id } = req.params; // restaurant id
    const { name, email, password } = req.body;
    if (!email || !password) return next(createError(400, "Email and password are required"));

    const restaurant = await Restaurant.findById(id).exec();
    if (!restaurant) return next(createError(404, "Restaurant not found"));

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);

    const normalizedEmail = String(email).toLowerCase();
    let user = await RestaurantUser.findOne({ restaurant: id }).exec();

    if (user) {
      // If changing email, ensure uniqueness
      if (user.email !== normalizedEmail) {
        const existing = await RestaurantUser.findOne({ email: normalizedEmail }).exec();
        if (existing) return next(createError(409, "Email is already in use."));
      }
      user.email = normalizedEmail;
      user.password = hashed;
      if (name) user.name = name;
      await user.save();
    } else {
      const existing = await RestaurantUser.findOne({ email: normalizedEmail }).exec();
      if (existing) return next(createError(409, "Email is already in use."));
      user = await RestaurantUser.create({
        restaurant: id,
        name: name || restaurant.name,
        email: normalizedEmail,
        password: hashed,
      });
    }

    return res.status(200).json({
      message: "Restaurant login saved",
      account: { _id: user._id, name: user.name, email: user.email, restaurant: id },
    });
  } catch (err) {
    next(err);
  }
};

