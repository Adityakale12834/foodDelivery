import mongoose from "mongoose";
import { createError } from "../error.js";
import Food from "../models/Food.js";

export const restaurantGetFoods = async (req, res, next) => {
  try {
    const restaurantId = req.restaurantId;
    const list = await Food.find({ restaurant: restaurantId })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const restaurantCreateFood = async (req, res, next) => {
  try {
    const restaurantId = req.restaurantId;
    const { name, desc, img, price, category, ingredients } = req.body;
    if (!name || !desc) return next(createError(400, "Name and description are required"));
    const ingredientsArr = Array.isArray(ingredients) ? ingredients : ingredients ? [ingredients] : [];
    const priceObj = price && typeof price === "object"
      ? { org: Number(price.org) || 0, mrp: Number(price.mrp) || 0, off: Number(price.off) || 0 }
      : { org: Number(price) || 0, mrp: Number(price) || 0, off: 0 };
    const categoryArr = Array.isArray(category) ? category : category ? [category] : [];
    const created = await Food.create({
      restaurant: restaurantId,
      name,
      desc: desc || "",
      img: img || null,
      price: priceObj,
      category: categoryArr,
      ingredients: ingredientsArr.length ? ingredientsArr : ["Standard"],
    });
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const restaurantUpdateFood = async (req, res, next) => {
  try {
    const restaurantId = req.restaurantId;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return next(createError(400, "Invalid food ID"));
    const food = await Food.findOne({ _id: id, restaurant: restaurantId }).exec();
    if (!food) return next(createError(404, "Food not found"));
    const { name, desc, img, price, category, ingredients } = req.body;
    if (name !== undefined) food.name = name;
    if (desc !== undefined) food.desc = desc;
    if (img !== undefined) food.img = img;
    if (price !== undefined) {
      if (typeof price === "object") {
        food.price = { org: Number(price.org) ?? 0, mrp: Number(price.mrp) ?? 0, off: Number(price.off) ?? 0 };
      } else {
        food.price = { org: Number(price) ?? 0, mrp: Number(price) ?? 0, off: 0 };
      }
    }
    if (category !== undefined) food.category = Array.isArray(category) ? category : [category];
    if (ingredients !== undefined) food.ingredients = Array.isArray(ingredients) ? ingredients : [ingredients];
    await food.save();
    return res.status(200).json(food);
  } catch (err) {
    next(err);
  }
};

export const restaurantDeleteFood = async (req, res, next) => {
  try {
    const restaurantId = req.restaurantId;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return next(createError(400, "Invalid food ID"));
    const deleted = await Food.findOneAndDelete({ _id: id, restaurant: restaurantId }).exec();
    if (!deleted) return next(createError(404, "Food not found"));
    return res.status(200).json({ message: "Food deleted" });
  } catch (err) {
    next(err);
  }
};
