import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true, // this optimize searching easy in database
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profilePhoto: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User",userSchema)