import Order from "../models/Order.js";
import logger from "../config/logger.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 }); // Más recientes primero

    return res.status(200).json({
      status: "success",
      message: "Historial de compras obtenido correctamente",
      payload: { orders },
    });
  } catch (error) {
    logger.error("Error al obtener historial:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener historial de compras",
      payload: { error: error.message },
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Orden no encontrada",
        payload: null,
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para ver esta orden",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Orden obtenida correctamente",
      payload: { order },
    });
  } catch (error) {
    logger.error("Error al obtener orden:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener orden",
      payload: { error: error.message },
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      message: "Órdenes obtenidas correctamente",
      payload: { orders },
    });
  } catch (error) {
    logger.error("Error al obtener órdenes:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener órdenes",
      payload: { error: error.message },
    });
  }
};
