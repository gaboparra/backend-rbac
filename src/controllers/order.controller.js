import {
  checkoutService,
  getMyOrdersService,
  getOrderByIdService,
  getAllOrdersService,
} from "../services/order.service.js";
import logger from "../config/logger.js";

export const checkout = async (req, res) => {
  try {
    const order = await checkoutService(req.user._id);

    return res.status(201).json({ order });
  } catch (error) {
    logger.error("Error during checkout:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error during checkout",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await getMyOrdersService(req.user._id);

    return res.status(200).json({ orders });
  } catch (error) {
    logger.error("Error fetching orders:", error);
    res.status(500).json({
      error: "Error fetching orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await getOrderByIdService(req.params.id, req.user._id);

    return res.status(200).json({ order });
  } catch (error) {
    logger.error("Error fetching order:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error fetching order",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersService();

    return res.status(200).json({ orders });
  } catch (error) {
    logger.error("Error fetching all orders:", error);
    res.status(500).json({
      error: "Error fetching orders",
    });
  }
};
