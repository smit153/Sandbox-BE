import mongoose from "mongoose";

const Schema = mongoose.Schema;

const codeSchema = new Schema({
  filename: { type: String, required: true },
  code: { type: String },
});

const SandboxSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  codes: [codeSchema],
});

export const Sandbox = mongoose.model("Sandbox", SandboxSchema);
