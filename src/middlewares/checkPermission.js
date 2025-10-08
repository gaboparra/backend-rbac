// const checkPermission = (requiredPermission) => {
//   return async (req, res, next) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           status: "error",
//           message: "Usuario no autenticado",
//           payload: null,
//         });
//       }

//       if (!req.user.role || !req.user.role.permissions) {
//         await req.user.populate({
//           path: "role",
//           populate: { path: "permissions" },
//         });
//       }

//       const hasPermission = req.user.role.permissions.some(
//         (perm) => perm.name === requiredPermission
//       );

//       if (!hasPermission) {
//         return res.status(403).json({
//           status: "error",
//           message: `No tienes permiso para realizar esta acción. Se requiere: ${requiredPermission}`,
//           payload: null,
//         });
//       }

//       next();
//     } catch (error) {
//       return res.status(500).json({
//         status: "error",
//         message: "Error al verificar permisos",
//         payload: { error: error.message },
//       });
//     }
//   };
// };

// export default checkPermission;
