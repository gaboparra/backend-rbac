const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado",
        payload: null,
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Acceso denegado. Se requiere rol de administrador",
        payload: null,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al verificar permisos de administrador",
      payload: { error: error.message },
    });
  }
};

export default isAdmin;
