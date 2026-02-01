import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";

export const AdminRegister = async (req, res, next) => {
  try {
    const secret = req.headers["x-admin-secret"] || req.body.adminSecret;
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return next(createError(403, "Invalid admin secret"));
    }

    const { email, password, name, img } = req.body;

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
      role: "admin",
    });

    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(201).json({ token, user: createdUser });
  } catch (err) {
    next(err);
  }
};

export const AdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) return next(createError(409, "User not found."));
    if (user.role !== "admin") return next(createError(403, "Admin only"));

    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const AdminMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id).select("-password").exec();
    if (!user) return next(createError(401, "You are not authenticated!"));
    if (user.role !== "admin") return next(createError(403, "Admin only"));
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const AdminGetAllOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name email role" })
      .populate({ path: "products.product", model: "Food" })
      .exec();
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const AdminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return next(createError(400, "Missing status"));
    const updated = await Orders.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate({ path: "user", select: "name email role" })
      .populate({ path: "products.product", model: "Food" })
      .exec();

    if (!updated) return next(createError(404, "Order not found"));
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

