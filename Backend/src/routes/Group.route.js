import { Router } from "express";
import { upload } from "../middleware/Multer.middleware.js";
import { jwtVerification } from "../middleware/Auth.middleware.js";
import { joinGroup, leaveGroup, updateGroupPhoto,groupData } from "../controllers/Group.controllers.js";
import { allGroups, groupChat } from "../controllers/Groupmessage.controllers.js";

const groupRoute = Router();

groupRoute.route("/create").post(joinGroup)
groupRoute.route("/:id/leave").post(jwtVerification,leaveGroup)
groupRoute.route("/:id/data").get(groupData)
groupRoute.route("/:id/photo").post(
  jwtVerification,
  upload.fields([
    {
      name: "groupPhoto",
      maxCount: 1,
    },
  ]),
  updateGroupPhoto
);

groupRoute.route("/groups").get(jwtVerification,allGroups)
groupRoute.route("/:id/chat").get(groupChat)

export { groupRoute };
