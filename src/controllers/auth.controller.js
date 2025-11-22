import {
  registerUserService,
  loginUserService,
  changePasswordService,
} from "../services/auth.service.js";
import logger from "../config/logger.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const result = await registerUserService({ username, email, password });

    return res.status(201).json(result);
  } catch (error) {
    logger.error("Error registering user:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error registering user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const result = await loginUserService({ email, password });

    return res.status(200).json(result);
  } catch (error) {
    logger.error("Error logging in:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error logging in",
    });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({
    message: "Logout successful",
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long",
      });
    }

    await changePasswordService(req.user._id, {
      currentPassword,
      newPassword,
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    logger.error("Error changing password:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error changing password",
    });
  }
};
