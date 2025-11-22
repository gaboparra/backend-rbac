import User from "../models/User.js";
import Role from "../models/Role.js";
import generateToken from "../utils/generateToken.js";

export const registerUserService = async (userData) => {
  const { username, email, password } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw { status: 400, message: "User already exists" };
  }

  const userRole = await Role.findOne({ name: "USER" });
  if (!userRole) {
    throw { status: 500, message: "USER role does not exist in the database" };
  }

  const user = await User.create({
    username,
    email,
    password,
    role: userRole._id,
  });

  await user.populate("role");

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role.name,
    },
    token,
  };
};

export const loginUserService = async (credentials) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email }).populate("role");
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role.name,
    },
  };
};

export const changePasswordService = async (userId, passwords) => {
  const { currentPassword, newPassword } = passwords;

  const user = await User.findById(userId);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw { status: 400, message: "Current password is incorrect" };
  }

  user.password = newPassword;
  await user.save();
};
