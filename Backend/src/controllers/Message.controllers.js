import { Message } from "../models/Message.model.js";
import { apiError } from "../utils/ApiError.utils.js";
import { apiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/AsyncHandler.utils.js";
import { User } from "../models/User.model.js";

const saveMessage = async({receiverId,senderId,content})=>{
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    return message
}

const conversation = asyncHandler(async(req,res)=>{
    const sender = req.user._id
    const receiver = req.params.id

    const conversation = await Message.find({
      $or: [
        { receiver: receiver, sender: sender },
        { receiver: sender, sender: receiver },
      ],
    }).sort({ createdAt: 1 })
    return res
    .status(200)
    .json(new apiResponse(200,conversation,"Successfully fetched the conversation"))
})

const allConversation = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const messagesSent = await Message.find(
   { sender: userId }
  ).select("receiver");

  const messagesReceive = await Message.find(
    {receiver:userId}
  ).select("sender");

  const userIds = new Set();

  messagesSent.forEach((msg) => {
      userIds.add(msg.receiver);
  });

  messagesReceive.forEach((msg) => {
    userIds.add(msg.sender);
  });

  if (userIds.size === 0) {
    throw new apiError(400, "No chats found");
  }

  const allConversation = await User.find({
    _id: { $in: Array.from(userIds) },
  }).select("_id username fullName profilePhoto");

  return res
    .status(200)
    .json(
      new apiResponse(200, allConversation, "Successfully fetched the chats")
    );
});





export {saveMessage,conversation,allConversation}