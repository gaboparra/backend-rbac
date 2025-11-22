import {
  getMyCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  clearCartService,
} from "../services/cart.service.js";
import logger from "../config/logger.js";

export const getMyCart = async (req, res) => {
  try {
    const cart = await getMyCartService(req.user._id);

    return res.status(200).json({ cart });
  } catch (error) {
    logger.error("Error fetching cart:", error);
    res.status(500).json({
      error: "Error fetching cart",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        error: "Product ID and quantity are required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    const cart = await addToCartService(req.user._id, {
      productId,
      quantity,
    });

    return res.status(200).json({ cart });
  } catch (error) {
    logger.error("Error adding to cart:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error adding to cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    const cart = await updateCartItemService(req.user._id, productId, quantity);

    return res.status(200).json({ cart });
  } catch (error) {
    logger.error("Error updating cart:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error updating cart",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await removeFromCartService(req.user._id, productId);

    return res.status(200).json({ cart });
  } catch (error) {
    logger.error("Error removing from cart:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error removing from cart",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await clearCartService(req.user._id);

    return res.status(200).json({ cart });
  } catch (error) {
    logger.error("Error clearing cart:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error clearing cart",
    });
  }
};
