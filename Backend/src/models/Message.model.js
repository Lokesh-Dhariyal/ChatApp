import mongoose, { Schema } from "mongoose";
import { User } from "./User.model.js";

const messageSchema = new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    content:{
        type:String
    },
    seen:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema)