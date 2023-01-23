import mongoose, { Schema } from "mongoose";

const companies = new Schema({ name: String, description: String });

export default mongoose.model("Companies", companies);
