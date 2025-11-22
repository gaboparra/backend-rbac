import User from "../models/User.js";
import Role from "../models/Role.js";

export const getMyProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password").populate("role");

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
};

export const getUsersService = async () => {
  const users = await User.find().select("-password").populate({
    path: "role",
    select: "-permissions",
  });

  return users;
};

export const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select("-password").populate("role");

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
};

export const updateUserService = async (userId, updateData) => {
  const { username, email } = updateData;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw { status: 400, message: "Email is already registered" };
    }
  }

  if (username) user.username = username;
  if (email) user.email = email;

  await user.save();
  await user.populate("role");

  return user;
};

export const deleteUserService = async (userId) => {
  const deleted = await User.findByIdAndDelete(userId);

  if (!deleted) {
    throw { status: 404, message: "User not found" };
  }
};

export const updateUserRoleService = async (userId, roleName) => {
  const role = await Role.findOne({ name: roleName.toUpperCase() });
  if (!role) {
    throw { status: 404, message: `Role '${roleName}' does not exist` };
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  user.role = role._id;
  await user.save();
  await user.populate("role");

  return user;
};
