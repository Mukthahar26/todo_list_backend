import { Request, Response } from "express";
import userDetailsModel from "../models/userDetailsModel";
import {
  addMinutesToCurrentUtc,
  currentUtcTime,
  formatResponse,
  prepareTransportorEmail,
  validateRequestParams,
} from "../utils/utils";
import { SALTCODE, responseCodes } from "../constants/constants";
import otpRequestModel from "../models/otpRequestModel";
import bcryptjs from "bcryptjs";

export const resetPassword = async (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { email } = req.body;
  const user = await userDetailsModel.findOne({ email });
  const transporter: any = await prepareTransportorEmail();
  if (user) {
    if (transporter) {
      const mailOptions = {
        from: process.env.GMAIL_ID,
        to: process.env.GMAIL_ID,
        subject: "[Todo App] OTP request for Reset Password",
        html: `<h1 style="text-align:center">OTP Request</h1><p style="text-align:center">Hello</p><p style="text-align:center">Please use following OTP to reset your password. This OTP will expire within ${process.env.OTPEXPIRYINMINUTES}min.</p><div style="text-align:center; height:40px;width:100px;border-radius:5px;background-color: black;text-align: center;line-height: 40px;margin: auto;margin-top:40px"><h2 style="color:white">19374</h2></div>`,
      };
      transporter
        .sendMail(mailOptions)
        .then(() => {
          const otp = Math.floor(1000 + Math.random() * 8999);
          const getTenMinutesAfterTime = addMinutesToCurrentUtc(10);
          otpRequestModel
            .findOneAndUpdate(
              { email },
              {
                $set: {
                  email,
                  otp,
                  otp_token: new Date().getTime(),
                  expire_at: getTenMinutesAfterTime,
                },
              },
              { new: true, upsert: true }
            )
            .then((data) => {
              const { code, message } = responseCodes.SUCCESS;
              res.json(formatResponse({ code, message, data }));
            })
            .catch((err) => {
              const { code } = responseCodes.ERROR;
              res.json(formatResponse({ code, message: err }));
            });
        })
        .catch((error: any) => {
          const { code, message } = responseCodes.ERROR;
          res.json(formatResponse({ code, message, data: error }));
        });
    }
  } else {
    const { code, message } = responseCodes.NORECORDSFOUND;
    res.json(formatResponse({ code, message }));
  }
};

export const updateNewPassword = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { email, otp_token, otp, newPassword } = req.body;
  otpRequestModel
    .findOne({
      email,
      otp_token,
      otp,
      expire_at: { $gte: currentUtcTime() },
    })
    .then((result) => {
      if (result) {
        bcryptjs.hash(newPassword, SALTCODE, (err: any, hashedPass: string) => {
          userDetailsModel
            .findOneAndUpdate(
              { email },
              { $set: { password: hashedPass } },
              { new: true }
            )
            .then((data) => {
              if (data) {
                const { code, message } = responseCodes.SUCCESS;
                res.json(formatResponse({ code, message, data }));
              } else {
                const { code, message } = responseCodes.NORECORDSFOUND;
                res.json(formatResponse({ code, message }));
              }
            });
        });
      } else {
        const { code } = responseCodes.NORECORDSFOUND;
        res.json(formatResponse({ code, message: "OTP expired" }));
      }
    });
};
