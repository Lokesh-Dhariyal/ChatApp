import {
  hashingPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
} from "../services/User.service.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/Cloudinary.utils.js";
import { apiError } from "../utils/ApiError.utils.js";
import { apiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { Message } from "../models/Message.model.js";
import { Group } from "../models/Group.model.js";
import { Groupmessage } from "../models/GroupMessage.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new apiError(400, "User not found");
    }
    const accessToken = generateAccessToken({
      _id: user._id,
      username: user.username,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
      username: user.username,
    });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while creating tokens");
  }
};

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // secure:false,
  sameSite: "None",
};

//⁡⁣⁣⁢⁡⁢⁢⁢𝗥𝗲𝗴𝗶𝘀𝘁𝗲𝗿 𝗨𝘀𝗲𝗿⁡(avatar will be added in the update user section as it is not needed while registration)
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  // if(!username || !email || !password){
  //     return apiError(400,"All fields are required")
  // }

  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new apiError(400, "All fields are required");
  }

  const exitedUsername = await User.findOne({ username });
  if (exitedUsername) {
    throw new apiError(400, "Username alredy exist");
  }
  const exitedEmail = await User.findOne({ email });
  if (exitedEmail) {
    throw new apiError(400, "Email already exist");
  }
  //hash password
  const hashedPassword = await hashingPassword(password);
  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    profilePhoto:
      "https://res.cloudinary.com/dhzxvjygz/image/upload/v1748512530/userImage_abfe44.png",
    online:true,
  });

  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id,
    user.username
  );
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200,{ user: createdUser, accessToken, refreshToken },"User registered Successfully")
    );
});

//⁡⁢⁢⁡⁢⁣⁡⁣⁣⁢⁡⁢⁢⁢𝗟𝗼𝗴𝗶𝗻 𝗨𝘀𝗲𝗿⁡
const loginUser = asyncHandler(async (req, res) => {
  const { credentials, password } = req.body;

  if ([credentials, password].some((field) => !field || field.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ username: credentials }, { email: credentials }],
  });

  if (!user) {
    throw new apiError(400, "User does not exist");
  }

  const checkedPassword = await isPasswordCorrect(password, user.password);
  if (!checkedPassword) {
    throw new apiError(400, "Invalid Credentials");
  }
  //generate tokens
  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id,
    user.username
  );

  const logginedUser = await User.findByIdAndUpdate(user._id,
    {online:true},
    {new:true}
  ).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: logginedUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});

//⁡⁢⁢⁢𝗟𝗼𝗴𝗼𝘂𝘁 𝗨𝘀𝗲𝗿⁡
const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const userOut = await User.findByIdAndUpdate(
    user._id,
    {
      online: false ,
      $unset: { refreshToken: "" }
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, userOut, "User logout successfully"));
});

//⁡⁢⁢⁢𝗨𝗽𝗱𝗮𝘁𝗲 𝗧𝗼𝗸𝗲𝗻𝘀 𝗪𝗵𝗲𝗻 𝗼𝗽𝗲𝗻𝗶𝗻𝗴 𝘁𝗵𝗲 𝗮𝗽𝗽⁡
const updateToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(400, "Invalid loggin attempt");
  }

  try {
    const verifiedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(verifiedToken?._id);
    if (!user) {
      throw new apiError(400, "Invalid Token");
    }
    if (incomingRefreshToken != user.refreshToken) {
      throw new apiError(400, "Refresh Token has been expired");
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
      user._id,
      user.username
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            refreshToken: refreshToken,
            accessToken: accessToken,
          },
          "Token is refreshed and updated"
        )
      );
  } catch (error) {
    throw new apiError(400, "Something went wrong while updating tokens");
  }
});

//⁡⁢⁢⁢𝗖𝗵𝗮𝗻𝗴𝗲 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱⁡
const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, previousPassword } = req.body;

  if (newPassword === previousPassword) {
    throw new apiError(400, "Password cant be same");
  }

  const user = await User.findById(req.user._id); // to get the password too
  if (!user) {
    throw new apiError(400, "User does not exist");
  }
  const checkPassword = await isPasswordCorrect(
    previousPassword,
    user.password
  );
  if (!checkPassword) {
    throw new apiError(400, "Invalid password");
  }

  const updatedpassword = await hashingPassword(newPassword);

  user.password = updatedpassword;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new apiResponse(200, updatedUser, "Password changed successfully"));
});

//⁡⁢⁢⁢𝗨𝗽𝗱𝗮𝘁𝗲 𝗣𝗿𝗼𝗳𝗶𝗹𝗲⁡
const updateUserInfo = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  //front end will handle that these field will be filled with the already exited ones, still
  if (
    ![fullName, email].every(
      (field) => typeof field === "string" && field.trim() !== ""
    )
  ) {
    throw new apiError(400, "Full name and email are required.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new apiError(
      400,
      "Something went wrong while updating the user profile"
    );
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "User's Profile updated successfully"));
});

//⁡⁢⁢⁢𝗨𝗽𝗱𝗮𝘁𝗲 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗣𝗵𝗼𝘁𝗼⁡
const updateProfilePhoto = asyncHandler(async (req, res) => {
  let profilePhotoLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.profilePhoto) &&
    req.files.profilePhoto.length > 0
  ) {
    profilePhotoLocalPath = req.files.profilePhoto[0].path;
  }
  const profilePhoto = await uploadToCloudinary(profilePhotoLocalPath);

  //delete previous profilephoto
  const photoInfoUser = await User.findById(req.user._id);
  if (
    photoInfoUser.profilePhoto !==
    "https://res.cloudinary.com/dhzxvjygz/image/upload/v1748512530/userImage_abfe44.png"
  ) {
    deleteFromCloudinary(photoInfoUser.profilePhoto);
  }
  //not holding this in try catch as it does not matter, just to make the cloud storage cleaner

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        profilePhoto:
          profilePhoto?.url ||
          "https://res.cloudinary.com/dhzxvjygz/image/upload/v1748512530/userImage_abfe44.png",
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new apiError(
      400,
      "Something went wrong while updating the user profilePhoto"
    );
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, user, "User's ProfilePhoto updated successfully")
    );
});

//⁡⁢⁢⁢𝗗𝗲𝗹𝗲𝘁𝗲 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗣⁡⁢⁢⁢𝗵𝗼𝘁𝗼⁡
const deleteProfilePhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);
  if (
    user.profilePhoto ==
    "https://res.cloudinary.com/dhzxvjygz/image/upload/v1748512530/userImage_abfe44.png"
  ) {
    throw new apiError(400, "There is nothing to delete");
  }
  const result = await deleteFromCloudinary(user.profilePhoto);

  if (result.result === "not found") {
    throw new apiError(400, "Image not found");
  }
  if (result.result !== "ok") {
    throw new apiError(
      400,
      "Something went wrong while deleting profile picture"
    );
  }
  user.profilePhoto =
    "https://res.cloudinary.com/dhzxvjygz/image/upload/v1748512530/userImage_abfe44.png";
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Profile Photo deleted successfully"));
});

//⁡⁢⁢⁢𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗨𝘀𝗲𝗿 𝗶𝗻𝗳𝗼⁡
const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "Current User fetched successfully"));
});

//⁡⁢⁢⁢𝗚𝗲𝘁 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼⁡
const userInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-pasword -refreshToken"
  );

  if (!user) {
    throw new apiError(400, "User Does not exist");
  }
  return res
    .status(200)
    .json(new apiResponse(200, user, "User fetched successfully"));
});

//⁡⁢⁢⁢𝗦𝗲𝗮𝗿𝗰𝗵 𝗨𝘀𝗲𝗿⁡
const searchUser = asyncHandler(async (req, res) => {
  const { search } = req.body;
  if (!search || search.trim() === "") {
    throw new apiError(400, "You havent searched anything");
  }

  const regex = new RegExp(search, "i"); // i, for case insensitive

  const user = await User.find({
    _id: { $ne: req.user._id },
    $or: [{ username: { $regex: regex } }, { fullName: { $regex: regex } }],
  }).select("_id username fullName profilePhoto");

  if (!user || user.length === 0) {
    throw new apiError(400, "No user found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Users fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Message.deleteMany({
    $or: [{ receiver: userId }, { sender: userId }],
  });//deleteMessage

  await Group.updateMany(
    { members: userId },
    { $pull: { members: userId } }
  );//remove from group

  const groupsToDelete = await Group.find({ members: { $size: 0 } });
  for (const group of groupsToDelete) {
    await Group.findByIdAndDelete(group._id);
  }

  await Groupmessage.deleteMany({
    senderId: userId,
  });//deleteGroupMessage

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new apiError(500, "Something went wrong while deleting the user");
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User deleted successfully"));
});


export {
  registerUser,
  loginUser,
  logoutUser,
  updateToken,
  changePassword,
  updateProfilePhoto,
  updateUserInfo,
  deleteProfilePhoto,
  currentUser,
  userInfo,
  searchUser,
  deleteUser,
};