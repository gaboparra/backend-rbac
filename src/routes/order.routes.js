import { Router } from "express";
import {
  getMyOrders,
  getOrderById,
  getAllOrders,
} from "../controllers/order.controller.js";
import authorization from "../middlewares/authorization.js";
import checkPermission from "../middlewares/checkPermission.js";

const router = Router();

router.get("/admin/all", authorization, checkPermission("orders:read"), getAllOrders);
router.get("/", authorization, getMyOrders);
router.get("/:id", authorization, getOrderById);

export default router;
