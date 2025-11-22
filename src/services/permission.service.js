import Permission from "../models/Permission.js";

export const getPermissionsService = async () => {
  const permissions = await Permission.find();
  return permissions;
};

export const getPermissionByIdService = async (permissionId) => {
  const permission = await Permission.findById(permissionId);

  if (!permission) {
    throw { status: 404, message: "Permission not found" };
  }

  return permission;
};

export const createPermissionService = async (permissionData) => {
  const { name, description } = permissionData;

  const existingPermission = await Permission.findOne({ name });
  if (existingPermission) {
    throw { status: 400, message: "Permission already exists" };
  }

  const permission = await Permission.create({ name, description });
  return permission;
};

export const updatePermissionService = async (permissionId, updateData) => {
  const { name, description } = updateData;

  const permission = await Permission.findById(permissionId);
  if (!permission) {
    throw { status: 404, message: "Permission not found" };
  }

  if (name && name !== permission.name) {
    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      throw {
        status: 400,
        message: "A permission with that name already exists",
      };
    }
  }

  if (name) permission.name = name;
  if (description) permission.description = description;

  await permission.save();
  return permission;
};

export const deletePermissionService = async (permissionId) => {
  const deleted = await Permission.findByIdAndDelete(permissionId);

  if (!deleted) {
    throw { status: 404, message: "Permission not found" };
  }
};
