import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//creating encrypted passwod
const hashingPassword = async (password) => {
  if (!password) throw new Error("Password needs to be encrypted");
  const encryptedPassword = await bcrypt.hash(password, 10); //10 is how many times bcrypt internally re-processes the data

  return encryptedPassword;
};

//checking if password is correct
const isPasswordCorrect = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

//Generating Access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

export {
  hashingPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
};
