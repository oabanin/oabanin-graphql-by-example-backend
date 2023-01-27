import mongoose, { Schema } from "mongoose";

const users = new Schema({
  email: String,
  password: String,
  compId: String,
});

export default mongoose.model("Users", users);
