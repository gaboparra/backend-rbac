import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios",
        payload: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Formato de email inválido",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "La contraseña debe tener al menos 6 caracteres",
        payload: null,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya existe",
        payload: null,
      });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      status: "success",
      message: "Usuario registrado exitosamente",
      payload: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al registrar usuario",
      payload: { error: error.message },
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email y contraseña son obligatorios",
        payload: null,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        payload: null,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales incorrectas",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Login exitoso",
      payload: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al iniciar sesión",
      payload: { error: error.message },
    });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Logout exitoso (token invalidado del lado cliente)",
    payload: null,
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Debe ingresar la contraseña actual y la nueva",
        payload: null,
      });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Contraseña actual incorrecta",
        payload: null,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "La nueva contraseña debe tener al menos 6 caracteres",
        payload: null,
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Contraseña actualizada correctamente",
      payload: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al cambiar la contraseña",
      payload: { error: error.message },
    });
  }
};
