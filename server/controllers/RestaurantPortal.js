import Orders from "../models/Orders.js";

export const restaurantGetOrders = async (req, res, next) => {
  try {
    const restaurantId = req.restaurantId;
    const orders = await Orders.find({ restaurant: restaurantId })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name email" })
      .populate({ path: "products.product", model: "Food" })
      .exec();
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const restaurantUpdateOrderStatus = async (req, res, next) => {
  try {
    const restaurantId = req.restaurantId;
    const { status } = req.body;
    const order = await Orders.findOneAndUpdate(
      { _id: req.params.id, restaurant: restaurantId },
      { status },
      { new: true }
    )
      .populate({ path: "user", select: "name email" })
      .populate({ path: "products.product", model: "Food" })
      .exec();

    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

