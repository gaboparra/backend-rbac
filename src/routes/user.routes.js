import { Router } from "express";
import {
  getMyProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import authorization from "../middlewares/authorization.js";
import isAdmin from "../middlewares/isAdmin.js";
import checkOwnerOrAdmin from "../middlewares/checkOwnerOrAdmin.js";

const router = Router();

router.get("/me", authorization, getMyProfile);
router.get("/", authorization, isAdmin, getUsers);
router.get("/:id", authorization, isAdmin, getUserById);
router.put("/:id", authorization, checkOwnerOrAdmin, updateUser);
router.delete("/:id", authorization, checkOwnerOrAdmin, deleteUser);
router.patch("/:id/role", authorization, isAdmin, updateUserRole);
export default router;
