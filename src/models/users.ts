import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  sandbox:[{ type: mongoose.Types.ObjectId, ref: "Sandbox" }],
});


export const User = mongoose.model("User", userSchema);