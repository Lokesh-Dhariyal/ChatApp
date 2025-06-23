import { Schema,model } from "mongoose";
import { Group } from "./Group.model.js";
import { User } from "./User.model.js";

const groupMessageSchema = new Schema({
    groupId:{
        type:Schema.Types.ObjectId,
        ref:Group
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    content:{
        type:String
    }
},{timestamps:true})

export const Groupmessage = model("Groupmessage",groupMessageSchema)