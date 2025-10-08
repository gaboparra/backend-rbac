import { Router } from "express";
import {
  register,
  login,
  logout,
  changePassword,
} from "../controllers/auth.controller.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

// Rutas de autenticación
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Ruta para cambiar la contraseña
router.put("/change-password", authorization, changePassword);

export default router;