import mongoose, { Schema } from "mongoose";

const job = new Schema({
  title: String,
  description: String,
  companyID: String,
});

export default mongoose.model("Jobs", job);
