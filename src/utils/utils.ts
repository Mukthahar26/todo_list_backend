import { Request, Response } from "express";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(utc);

export const getLastEndpoint = (str: string) =>
  str && str.split("/")[str.length - 1];

export const isKeyEmpty = (str: string) => str && str.trim().length > 0;

type responetype = {
  data?: any;
  code?: string;
  message?: string;
};
export const formatResponse = ({
  code = "00",
  message = "Success",
  data = null,
}: responetype) => {
  return {
    code,
    message,
    data,
  };
};

export const validateRequestParams = (request: Request, response: Response) => {
  const errorList = validationResult(request);
  if (!errorList.isEmpty()) {
    response.status(400).json({
      message: "Request param Validation errors",
      errors: errorList.array(),
    });
  }
};

export const isDateUtc = (date: string) => date && dayjs.utc(date).isUTC();

export const prepareTransportorEmail = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.APP_PASSCODE,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  return new Promise((resolve, reject) => {
    transporter
      .verify()
      .then(() => {
        resolve(transporter);
        console.log("Transporter is ready");
      })
      .catch((error) => {
        reject(false);
        console.error("Error verifying transporter:", error);
      });
  });
};

export const addMinutesToCurrentUtc = (minutes: number) =>
  minutes &&
  dayjs().add(minutes, "minute").utc().format("YYYY-MM-DDTHH:mm:ss[Z]");

export const currentUtcTime = (format: string = "YYYY-MM-DDTHH:mm:ss[Z]") =>
  dayjs().utc().format(format);
