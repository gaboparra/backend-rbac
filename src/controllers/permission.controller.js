import Permission from "../models/Permission.js";
import logger from "../config/logger.js";

export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();

    return res.status(200).json({
      status: "success",
      message: "Permisos obtenidos correctamente",
      payload: { permissions },
    });
  } catch (error) {
    logger.error("Error al obtener permisos", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error al obtener permisos",
      payload: { error: error.message },
    });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({
        status: "error",
        message: "Permiso no encontrado",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Permiso obtenido correctamente",
      payload: { permission },
    });
  } catch (error) {
    logger.error("Error al obtener permiso", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error al obtener permiso",
      payload: { error: error.message },
    });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Nombre y descripción son obligatorios",
        payload: null,
      });
    }

    const existingPermission = await Permission.findOne({ name });

    if (existingPermission) {
      return res.status(400).json({
        status: "error",
        message: "El permiso ya existe",
        payload: null,
      });
    }

    const permission = await Permission.create({ name, description });

    return res.status(201).json({
      status: "success",
      message: "Permiso creado exitosamente",
      payload: { permission },
    });
  } catch (error) {
    logger.error("Error al crear permiso", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error al crear permiso",
      payload: { error: error.message },
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "El nombre del permiso no puede estar vacío",
        payload: null,
      });
    }

    if (description !== undefined && description.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "La descripción no puede estar vacía",
        payload: null,
      });
    }

    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({
        status: "error",
        message: "Permiso no encontrado",
        payload: null,
      });
    }

    if (name && name !== permission.name) {
      const existingPermission = await Permission.findOne({ name });
      if (existingPermission) {
        return res.status(400).json({
          status: "error",
          message: "Ya existe un permiso con ese nombre",
          payload: null,
        });
      }
    }

    if (name) permission.name = name;
    if (description) permission.description = description;

    await permission.save();

    return res.status(200).json({
      status: "success",
      message: "Permiso actualizado correctamente",
      payload: { permission },
    });
  } catch (error) {
    logger.error("Error al actualizar permiso", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error al actualizar permiso",
      payload: { error: error.message },
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const deleted = await Permission.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Permiso no encontrado",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Permiso eliminado correctamente",
      payload: null,
    });
  } catch (error) {
    logger.error("Error al eliminar permiso", { message: error.message });
    res.status(500).json({
      status: "error",
      message: "Error al eliminar permiso",
      payload: { error: error.message },
    });
  }
};
