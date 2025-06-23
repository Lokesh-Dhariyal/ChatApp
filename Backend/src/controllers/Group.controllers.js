import { Group } from "../models/Group.model.js";
import { Groupmessage } from "../models/GroupMessage.model.js";
import { apiError } from "../utils/ApiError.utils.js";
import { apiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/Cloudinary.utils.js";

const joinGroup = asyncHandler(async(req,res)=>{
    const {members,groupName} = req.body

    const group = await Group.create({
      groupName,
      members,
      groupPhoto:"https://res.cloudinary.com/dhzxvjygz/image/upload/v1750614054/group_zly6nw.png",
    });
    if(!group){
        throw new apiError(400,"Something went wrong while creating group")
    }
    return res
    .status(200)
    .json(new apiResponse(200,group,"Group was created"))
})

const leaveGroup = asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const groupId = req.params.id
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    );
    if (!updatedGroup) {
      return res
        .status(400)
        .json(new apiResponse(400, null, "Group not found or user not a member"));
    }

    if (updatedGroup.members.length == 0) {
      await Group.findByIdAndDelete(updatedGroup._id);
      await Groupmessage.deleteMany({groupId:updatedGroup._id})
      return res.status(200).json(apiResponse(200, null, "Group deleted, all members left"));
    }

    return res
    .status(200)
    .json(new apiResponse(200,updatedGroup,"Left Successfully"))
})

const groupData = asyncHandler(async(req,res)=>{
  const groupId = req.params.id

  const group = await Group.findById(groupId).populate({
    path:"members",
    select:"profilePhoto fullName"
  })
  if(!group){
    throw new apiError("Group dont exist")
  }
  return res
  .status(200)
  .json(new apiResponse(200,group,"Successfull"))
})

const updateGroupPhoto = asyncHandler(async (req, res) => {
  const groupId = req.params.id;
  let groupPhotoLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.groupPhoto) &&
    req.files.groupPhoto.length > 0
  ) {
    groupPhotoLocalPath = req.files.groupPhoto[0].path;
  }
  const groupPhoto = await uploadToCloudinary(groupPhotoLocalPath);

  //delete previous groupPhoto
  const photoInfoGroup = await Group.findById(groupId);
  if (
    photoInfoGroup.groupPhoto !==
    "https://res.cloudinary.com/dhzxvjygz/image/upload/v1750614054/group_zly6nw.png"
  ) {
    deleteFromCloudinary(photoInfoGroup.groupPhoto);
  }
  //not holding this in try catch as it does not matter, just to make the cloud storage cleaner

  const group = await Group.findByIdAndUpdate(
    groupId,
    {
      $set: {
        groupPhoto:
          groupPhoto?.url ||
          "https://res.cloudinary.com/dhzxvjygz/image/upload/v1750614054/group_zly6nw.png",
      },
    },
    { new: true }
  );

  if (!group) {
    throw new apiError(
      400,
      "Something went wrong while updating the group profilePhoto"
    );
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, group, "group's ProfilePhoto updated successfully")
    );
});

export { joinGroup, leaveGroup, updateGroupPhoto, groupData };