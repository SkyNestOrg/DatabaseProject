// utils/hash.js
import bcrypt from "bcrypt";

// Named export
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Optional: password compare function
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
