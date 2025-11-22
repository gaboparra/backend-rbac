import Role from "../models/Role.js";
import Permission from "../models/Permission.js";

export const getRolesService = async () => {
  const roles = await Role.find().populate("permissions");
  return roles;
};

export const getRoleByIdService = async (roleId) => {
  const role = await Role.findById(roleId).populate("permissions");

  if (!role) {
    throw { status: 404, message: "Role not found" };
  }

  return role;
};

export const createRoleService = async (roleData) => {
  const { name, description } = roleData;

  const existingRole = await Role.findOne({ name: name.toUpperCase() });
  if (existingRole) {
    throw { status: 400, message: "Role already exists" };
  }

  const role = await Role.create({
    name: name.toUpperCase(),
    description,
    permissions: [],
  });

  return role;
};

export const updateRoleService = async (roleId, updateData) => {
  const { name, description } = updateData;

  const role = await Role.findById(roleId);
  if (!role) {
    throw { status: 404, message: "Role not found" };
  }

  if (name && name.toUpperCase() !== role.name) {
    const existingRole = await Role.findOne({ name: name.toUpperCase() });
    if (existingRole) {
      throw { status: 400, message: "A role with that name already exists" };
    }
  }

  if (name) role.name = name.toUpperCase();
  if (description) role.description = description;

  await role.save();
  await role.populate("permissions");

  return role;
};

export const deleteRoleService = async (roleId) => {
  const deleted = await Role.findByIdAndDelete(roleId);

  if (!deleted) {
    throw { status: 404, message: "Role not found" };
  }
};

export const assignPermissionsService = async (roleId, permissionIds) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw { status: 404, message: "Role not found" };
  }

  const foundPermissions = await Permission.find({
    _id: { $in: permissionIds },
  });

  if (foundPermissions.length !== permissionIds.length) {
    throw { status: 400, message: "Some permissions do not exist" };
  }

  permissionIds.forEach((permId) => {
    if (!role.permissions.includes(permId)) {
      role.permissions.push(permId);
    }
  });

  await role.save();
  await role.populate("permissions");

  return role;
};

export const unassignPermissionsService = async (roleId, permissionIds) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw { status: 404, message: "Role not found" };
  }

  role.permissions = role.permissions.filter(
    (permId) => !permissionIds.includes(permId.toString())
  );

  await role.save();
  await role.populate("permissions");

  return role;
};
