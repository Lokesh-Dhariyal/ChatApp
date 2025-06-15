import jwt from "jsonwebtoken"
import { apiError } from "./ApiError.utils.js";
import { User } from "../models/User.model.js";

const verifyToken = async(tokens)=>{
    if(!tokens){
        throw new apiError(400,"Tokens not available")
    }
    let decoded;
    try {
        decoded = jwt.verify(tokens, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new apiError(400,"Invalid tokens or expired")
    }
    const user = await User.findById(decoded._id).select("-password -refreshToken")
    if (!user){
        throw new apiError(400, "User not found");
    }
    return user
}

export {verifyToken}