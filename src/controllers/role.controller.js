import {
  getRolesService,
  getRoleByIdService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
  assignPermissionsService,
  unassignPermissionsService,
} from "../services/role.service.js";
import logger from "../config/logger.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await getRolesService();

    return res.status(200).json({ roles });
  } catch (error) {
    logger.error("Error fetching roles:", error);
    res.status(500).json({
      error: "Error fetching roles",
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await getRoleByIdService(req.params.id);

    return res.status(200).json({ role });
  } catch (error) {
    logger.error("Error fetching role:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error fetching role",
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: "Name and description are required",
      });
    }

    const role = await createRoleService({ name, description });

    return res.status(201).json({ role });
  } catch (error) {
    logger.error("Error creating role:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error creating role",
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        error: "Name cannot be empty",
      });
    }

    if (description !== undefined && description.trim() === "") {
      return res.status(400).json({
        error: "Description cannot be empty",
      });
    }

    const role = await updateRoleService(req.params.id, { name, description });

    return res.status(200).json({ role });
  } catch (error) {
    logger.error("Error updating role:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error updating role",
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    await deleteRoleService(req.params.id);

    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting role:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error deleting role",
    });
  }
};

export const assignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        error: "permissions must be an array of permission IDs",
      });
    }

    const role = await assignPermissionsService(req.params.id, permissions);

    return res.status(200).json({ role });
  } catch (error) {
    logger.error("Error assigning permissions:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error assigning permissions",
    });
  }
};

export const unassignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        error: "permissions must be an array of permission IDs",
      });
    }

    const role = await unassignPermissionsService(req.params.id, permissions);

    return res.status(200).json({ role });
  } catch (error) {
    logger.error("Error unassigning permissions:", error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Error unassigning permissions",
    });
  }
};
