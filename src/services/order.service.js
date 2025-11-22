import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const checkoutService = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw { status: 400, message: "Cart is empty" };
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (!product) {
      throw { status: 404, message: `Product ${item.product.name} not found` };
    }

    if (!product.isActive) {
      throw {
        status: 400,
        message: `Product ${product.name} is not available`,
      };
    }

    if (product.stock < item.quantity) {
      throw {
        status: 400,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      };
    }
  }

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    user: userId,
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalPrice: cart.totalPrice,
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  await order.populate("items.product");

  return order;
};

export const getMyOrdersService = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });

  return orders;
};

export const getOrderByIdService = async (orderId, userId) => {
  const order = await Order.findById(orderId).populate("items.product");

  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  if (order.user.toString() !== userId.toString()) {
    throw {
      status: 403,
      message: "You do not have permission to view this order",
    };
  }

  return order;
};

export const getAllOrdersService = async () => {
  const orders = await Order.find()
    .populate("user", "username email")
    .populate("items.product")
    .sort({ createdAt: -1 });

  return orders;
};
