import mongoose, { ConnectOptions } from "mongoose";

const url = process.env.MONGODBURL as string;

const mongooseClient = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

export default mongooseClient;
