import User from "../models/User.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Perfil obtenido correctamente",
      payload: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener perfil",
      payload: { error: error.message },
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      payload: { users },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios",
      payload: { error: error.message },
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario obtenido correctamente",
      payload: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener usuario",
      payload: { error: error.message },
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (username !== undefined && username.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "El nombre de usuario no puede estar vacío",
      });
    }

    if (email !== undefined) {
      if (email.trim() === "") {
        return res.status(400).json({
          status: "error",
          message: "El email no puede estar vacío",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Formato de email inválido",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({
          status: "error",
          message: "El email ya está registrado",
        });
      }
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente",
      payload: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar usuario",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario eliminado correctamente",
      payload: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar usuario",
      payload: { error: error.message },
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        status: "error",
        message: "El campo 'role' es obligatorio",
        payload: null,
      });
    }

    if (role !== "user" && role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "El rol debe ser 'user' o 'admin'",
        payload: null,
      });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        payload: null,
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: `Rol actualizado a '${role}' correctamente`,
      payload: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar el rol del usuario",
      payload: { error: error.message },
    });
  }
};
