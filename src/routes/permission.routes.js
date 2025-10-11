import { Router } from "express";
import {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission.controller.js";
import authorization from "../middlewares/authorization.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get("/", authorization, isAdmin, getPermissions);
router.get("/:id", authorization, isAdmin, getPermissionById);
router.post("/", authorization, isAdmin, createPermission);
router.put("/:id", authorization, isAdmin, updatePermission);
router.delete("/:id", authorization, isAdmin, deletePermission);

export default router;
