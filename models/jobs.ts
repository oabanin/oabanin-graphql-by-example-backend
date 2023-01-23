import mongoose, { Schema } from "mongoose";

const jobs = new Schema({
  title: String,
  description: String,
  compId: String,
});

export default mongoose.model("Jobs", jobs);
