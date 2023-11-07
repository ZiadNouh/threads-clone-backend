import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("mongoDB is connected");
    });
  } catch (error) {
    console.error(`Error :${error.message}`);
  }
};
