import { Router } from "express";
import { upload } from "../middleware/Multer.middleware.js";
import {
  loginUser,
  registerUser,
  logoutUser,
  updateToken,
  changePassword,
  updateProfilePhoto,
  updateUserInfo,
  deleteProfilePhoto,
  currentUser,
  userInfo,
  searchUser,
} from "../controllers/User.controllers.js";
import { jwtVerification } from "../middleware/Auth.middleware.js";
const userRoute = Router();

userRoute.route("/register").post(registerUser);
userRoute.route("/login").post(loginUser);
userRoute.route("/logout").post(jwtVerification, logoutUser);
userRoute.route("/update-token").post(updateToken);
userRoute.route("/change-password").post(jwtVerification, changePassword);
userRoute.route("/update-profilephoto").post(
  jwtVerification,
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
  ]),
  updateProfilePhoto
);
userRoute.route("/update-userinfo").post(jwtVerification, updateUserInfo);
userRoute.route("/delete-profilephoto").post(jwtVerification, deleteProfilePhoto);
userRoute.route("/me").get(jwtVerification, currentUser);
userRoute.route("/profile/:id").get(userInfo);
userRoute.route("/search").get(searchUser);

export { userRoute };
