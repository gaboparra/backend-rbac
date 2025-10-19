import logger from "../config/logger.js";

const checkOwnerOrPermission = (requiredPermission) => {
  return async (req, res, next) => {
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

      if (currentUserId === userId) {
        return next();
      }

      if (!req.user.role || !req.user.role.permissions) {
        await req.user.populate({
          path: "role",
          populate: { path: "permissions" },
        });
      }

      const hasPermission = req.user.role.permissions.some(
        (perm) => perm.name === requiredPermission
      );

      if (hasPermission) {
        return next();
      }

      return res.status(403).json({
        status: "error",
        message: `No puedes modificar o eliminar a otro usuario sin permisos suficientes. 
                  Necesitas el permiso: ${requiredPermission}`,
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
};

export default checkOwnerOrPermission;
