import {
  getMyProfileService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  updateUserRoleService,
} from "../services/user.service.js";
import logger from "../config/logger.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await getMyProfileService(req.user._id);

    return res.status(200).json({ user });
  } catch (error) {
    logger.error("Error fetching profile:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error fetching profile",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();

    return res.status(200).json({ users });
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({
      error: "Error fetching users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);

    return res.status(200).json({ user });
  } catch (error) {
    logger.error("Error fetching user:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error fetching user",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (username !== undefined && username.trim() === "") {
      return res.status(400).json({
        error: "Username cannot be empty",
      });
    }

    if (email !== undefined && email.trim() === "") {
      return res.status(400).json({
        error: "Email cannot be empty",
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }
    }

    const user = await updateUserService(req.params.id, { username, email });

    res.status(200).json({ user });
  } catch (error) {
    logger.error("Error updating user:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error updating user",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting user:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error deleting user",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(400).json({
        error: "roleName is required",
      });
    }

    const user = await updateUserRoleService(req.params.id, roleName);

    return res.status(200).json({ user });
  } catch (error) {
    logger.error("Error updating user role:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error updating user role",
    });
  }
};
