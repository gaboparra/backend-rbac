import logger from "../config/logger.js";

const checkOwnerOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado",
        payload: null,
      });
    }

    const userId = req.params.id;
    const currentUserId = req.user._id.toString();
    const isAdmin = req.user.role?.name === "ADMIN";

    if (isAdmin || currentUserId === userId) {
      return next();
    }

    return res.status(403).json({
      status: "error",
      message: "Acceso denegado. Solo puedes modificar tu propio perfil",
      payload: null,
    });
  } catch (error) {
    logger.error("Error al verificar permisos", { message: error.message });
    return res.status(500).json({
      status: "error",
      message: "Error al verificar permisos",
      payload: { error: error.message },
    });
  }
};

export default checkOwnerOrAdmin;
