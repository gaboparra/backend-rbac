import Role from "../models/Role.js";
import Permission from "../models/Permission.js";

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    return res.status(200).json({
      status: "success",
      message: "Roles obtenidos correctamente",
      payload: { roles },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener roles",
      payload: { error: error.message },
    });
  }
};

// Obtener un rol por ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions");

    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Rol no encontrado",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Rol obtenido correctamente",
      payload: { role },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener rol",
      payload: { error: error.message },
    });
  }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Nombre y descripción son obligatorios",
        payload: null,
      });
    }

    const existingRole = await Role.findOne({ name: name.toUpperCase() });
    if (existingRole) {
      return res.status(400).json({
        status: "error",
        message: "El rol ya existe",
        payload: null,
      });
    }

    const role = await Role.create({
      name: name.toUpperCase(),
      description,
      permissions: [],
    });

    return res.status(201).json({
      status: "success",
      message: "Rol creado exitosamente",
      payload: { role },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear rol",
      payload: { error: error.message },
    });
  }
};

// Actualizar un rol por ID
export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "El nombre no puede estar vacío",
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

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Rol no encontrado",
        payload: null,
      });
    }

    if (name && name.toUpperCase() !== role.name) {
      const existingRole = await Role.findOne({ name: name.toUpperCase() });
      if (existingRole) {
        return res.status(400).json({
          status: "error",
          message: "Ya existe un rol con ese nombre",
          payload: null,
        });
      }
    }

    if (name) role.name = name.toUpperCase();
    if (description) role.description = description;

    await role.save();
    await role.populate("permissions");

    return res.status(200).json({
      status: "success",
      message: "Rol actualizado correctamente",
      payload: { role },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar rol",
      payload: { error: error.message },
    });
  }
};

// Eliminar un rol por ID
export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Rol no encontrado",
        payload: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Rol eliminado correctamente",
      payload: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar rol",
      payload: { error: error.message },
    });
  }
};

// Asignar permisos a un rol
export const assignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar un array de IDs de permisos",
        payload: null,
      });
    }

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        status: "error",
        message: "Rol no encontrado",
        payload: null,
      });
    }

    const foundPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    if (foundPermissions.length !== permissions.length) {
      return res.status(400).json({
        status: "error",
        message: "Algunos permisos no existen",
        payload: null,
      });
    }

    role.permissions = permissions;
    await role.save();
    await role.populate("permissions");

    return res.status(200).json({
      status: "success",
      message: "Permisos asignados correctamente",
      payload: { role },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al asignar permisos",
      payload: { error: error.message },
    });
  }
};
