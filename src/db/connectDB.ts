import mongoose from "mongoose";

const connectDB = async (URL: string) => {
  return mongoose.connect(URL);
};

export default connectDB;
