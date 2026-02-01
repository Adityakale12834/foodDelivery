import mongoose from "mongoose";
import { createError } from "../error.js";
import Restaurant from "../models/Restaurant.js";

export const adminCreateRestaurant = async (req, res, next) => {
  try {
    const { name, description, address, phone, img, isActive } = req.body;
    if (!name || !address) return next(createError(400, "Name and address are required"));

    const created = await Restaurant.create({
      name,
      description: description || "",
      address,
      phone: phone || "",
      img: img || "",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const adminGetRestaurants = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { address: { $regex: new RegExp(search, "i") } },
      ];
    }
    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 }).exec();
    return res.status(200).json(restaurants);
  } catch (err) {
    next(err);
  }
};

export const adminGetRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return next(createError(400, "Invalid restaurant ID"));
    const restaurant = await Restaurant.findById(id).exec();
    if (!restaurant) return next(createError(404, "Restaurant not found"));
    return res.status(200).json(restaurant);
  } catch (err) {
    next(err);
  }
};

export const adminUpdateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return next(createError(400, "Invalid restaurant ID"));

    const patch = {};
    ["name", "description", "address", "phone", "img", "isActive"].forEach((k) => {
      if (req.body[k] !== undefined) patch[k] = req.body[k];
    });

    const updated = await Restaurant.findByIdAndUpdate(id, patch, { new: true }).exec();
    if (!updated) return next(createError(404, "Restaurant not found"));
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const adminDeleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return next(createError(400, "Invalid restaurant ID"));
    const deleted = await Restaurant.findByIdAndDelete(id).exec();
    if (!deleted) return next(createError(404, "Restaurant not found"));
    return res.status(200).json({ message: "Restaurant deleted" });
  } catch (err) {
    next(err);
  }
};

// Public: list active restaurants (for user homepage)
export const getPublicRestaurants = async (req, res, next) => {
  try {
    const list = await Restaurant.find({ isActive: true })
      .sort({ name: 1 })
      .select("name description address phone img")
      .exec();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

