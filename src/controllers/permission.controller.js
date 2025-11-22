import {
  getPermissionsService,
  getPermissionByIdService,
  createPermissionService,
  updatePermissionService,
  deletePermissionService,
} from "../services/permission.service.js";
import logger from "../config/logger.js";

export const getPermissions = async (req, res) => {
  try {
    const permissions = await getPermissionsService();

    return res.status(200).json({ permissions });
  } catch (error) {
    logger.error("Error fetching permissions:", error);
    res.status(500).json({
      error: "Error fetching permissions",
    });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const permission = await getPermissionByIdService(req.params.id);

    return res.status(200).json({ permission });
  } catch (error) {
    logger.error("Error fetching permission:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error fetching permission",
    });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: "Name and description are required",
      });
    }

    const permission = await createPermissionService({ name, description });

    return res.status(201).json({ permission });
  } catch (error) {
    logger.error("Error creating permission:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error creating permission",
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        error: "Permission name cannot be empty",
      });
    }

    if (description !== undefined && description.trim() === "") {
      return res.status(400).json({
        error: "Description cannot be empty",
      });
    }

    const permission = await updatePermissionService(req.params.id, {
      name,
      description,
    });

    return res.status(200).json({ permission });
  } catch (error) {
    logger.error("Error updating permission:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error updating permission",
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    await deletePermissionService(req.params.id);

    return res.status(200).json({
      message: "Permission deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting permission:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error deleting permission",
    });
  }
};
