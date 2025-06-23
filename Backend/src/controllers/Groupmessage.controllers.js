import { Group } from "../models/Group.model.js";
import { Groupmessage } from "../models/GroupMessage.model.js";
import { apiError } from "../utils/ApiError.utils.js";
import { apiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";

const saveGroupMessage = async({groupId,senderId,content})=>{
    const message = await Groupmessage.create({
        groupId,
        senderId,
        content
    })
    const returnMessage = await Groupmessage.findById(message._id).populate("senderId","profilePhoto fullName")
    return returnMessage;
}

const allGroups = asyncHandler(async(req,res)=>{
    const user = req.user._id

    const groups = await Group.find({members:user})

    return res
    .status(200)
    .json(new apiResponse(200,groups,"All groups fetched"))
})

const groupChat = asyncHandler(async(req,res)=>{
    const groupId = req.params.id

    const groupExists = await Group.findById(groupId);
    if (!groupExists) {
        return res
        .status(404)
        .json( new apiResponse(404, null, "Group not found"));
    }

    const allChat = await Groupmessage.find({groupId}).populate("senderId","profilePhoto fullName")

    return res
    .status(200)
    .json(new apiResponse(200,allChat,"All chat fetched"))
})

export {saveGroupMessage,allGroups,groupChat}