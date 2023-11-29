import mongoose from "mongoose";

const otpRequestModel = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otp_token: {
    type: String,
    required: true,
  },
  expire_at: {
    type: String,
    required: true,
  },
});

export default mongoose.model("otpRequestModel", otpRequestModel);
