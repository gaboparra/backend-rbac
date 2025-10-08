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
// import checkPermission from "../middlewares/checkPermission.js";

const router = Router();

// Rutas personales
router.get("/me", authorization, getMyProfile);

// Rutas solo para administradores
router.get("/", authorization, isAdmin, getUsers);
router.get("/:id", authorization, isAdmin, getUserById);
router.patch("/:id/role", authorization, isAdmin, updateUserRole);

// Rutas accesibles por el propio usuario o un admin
router.put("/:id", authorization, checkOwnerOrAdmin, updateUser);
router.delete("/:id", authorization, checkOwnerOrAdmin, deleteUser);

// router.get("/me", authorization, getMyProfile);
// router.get("/", authorization, checkPermission("users:read"), getUsers);
// router.get("/:id", authorization, checkPermission("users:read"), getUserById);
// router.put("/:id", authorization, checkOwnerOrAdmin, updateUser);
// router.delete("/:id", authorization, checkOwnerOrAdmin, deleteUser);
// router.patch("/:id/role", authorization, checkPermission("users:update"), updateUserRole);

export default router;
