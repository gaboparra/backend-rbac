import { Router } from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
} from "../controllers/role.controller.js";
import authorization from "../middlewares/authorization.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get("/", authorization, isAdmin, getRoles);
router.get("/:id", authorization, isAdmin, getRoleById);
router.post("/", authorization, isAdmin, createRole);
router.put("/:id", authorization, isAdmin, updateRole);
router.delete("/:id", authorization, isAdmin, deleteRole);
router.put("/:id/permissions", authorization, isAdmin, assignPermissions);

export default router;
