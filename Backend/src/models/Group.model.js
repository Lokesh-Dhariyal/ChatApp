import mongoose ,{ Schema } from "mongoose";
import { User } from "./User.model.js";

const groupSchema = new Schema({
    groupName:{
        type:String,
        required:true
    },
    members:[
        {type:Schema.Types.ObjectId,
        ref:User}
    ],
    groupPhoto:{
        type:String
    }
},{timestamps:true})

export const Group = mongoose.model("Group",groupSchema)