import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getMyCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalPrice: 0,
    });
  }

  return cart;
};

export const addToCartService = async (userId, cartData) => {
  const { productId, quantity } = cartData;

  const product = await Product.findById(productId);
  if (!product) {
    throw { status: 404, message: "Product not found" };
  }

  if (!product.isActive) {
    throw { status: 400, message: "Product not available" };
  }

  if (product.stock < quantity) {
    throw {
      status: 400,
      message: `Insufficient stock. Available: ${product.stock}`,
    };
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  cart.calculateTotal();
  await cart.save();
  await cart.populate("items.product");

  return cart;
};

export const updateCartItemService = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw { status: 404, message: "Cart not found" };
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw { status: 404, message: "Product not found in cart" };
  }

  const product = await Product.findById(productId);
  if (product.stock < quantity) {
    throw {
      status: 400,
      message: `Insufficient stock. Available: ${product.stock}`,
    };
  }

  item.quantity = quantity;
  cart.calculateTotal();
  await cart.save();
  await cart.populate("items.product");

  return cart;
};

export const removeFromCartService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw { status: 404, message: "Cart not found" };
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId
  );

  if (!itemExists) {
    throw { status: 404, message: "Product not found in cart" };
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.calculateTotal();
  await cart.save();
  await cart.populate("items.product");

  return cart;
};

export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw { status: 404, message: "Cart not found" };
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return cart;
};
