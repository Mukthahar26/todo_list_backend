import { Request, Response } from "express";
import userDetailsModel from "../models/userDetailsModel";
import { SALTCODE, responseCodes } from "../constants/constants";
import { formatResponse, validateRequestParams } from "../utils/utils";
import bcryptjs from "bcryptjs";
import { v4 } from "uuid";
import jsonwebtoken from "jsonwebtoken";

export const registrationController = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { fullName, email, mobileNo, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    userDetailsModel
      .findOne({ email })
      .then((data) => {
        if (data) {
          const { code, message } = responseCodes.ALREADYEXIST;
          res.json(formatResponse({ code, message }));
        } else {
          bcryptjs.hash(password, SALTCODE, (err: any, hashedPass: string) => {
            if (err) {
              const { code, message } = responseCodes.ERROR;
              res.json(formatResponse({ code, message }));
            }
            const userModel = new userDetailsModel({
              id: v4(),
              fullName,
              email,
              mobileNo,
              password: hashedPass,
            });
            userModel
              .save()
              .then((data) => {
                const { code, message } = responseCodes.SUCCESS;
                res.json(formatResponse({ code, message, data }));
              })
              .catch((err) => {
                const { code } = responseCodes.ERROR;
                res.json(formatResponse({ code, message: err }));
              });
          });
        }
      })
      .catch((err) => {
        const { code } = responseCodes.ERROR;
        res.json(formatResponse({ code, message: err }));
      });
  } else {
    const { code, message } = responseCodes.PASSWORDNOTMATCHED;
    res.json(formatResponse({ code, message }));
  }
};

export const loginController = (req: Request, res: Response) => {
  validateRequestParams(req, res);

  const { email, password } = req.body;
  const notFound = () => {
    const { message, code } = responseCodes.NORECORDSFOUND;
    res.json(formatResponse({ code, message: `User ${message}` }));
  };
  userDetailsModel
    .findOne({ email })
    .then((data) => {
      if (data) {
        const compare = bcryptjs.compareSync(password, data.password);
        if (compare) {
          const { message, code } = responseCodes.SUCCESS;
          let token = jsonwebtoken.sign(data.toObject(), "secret", {
            expiresIn: process.env.AUTHTOKENLIFESPAN,
          });
          let refreshToken = jsonwebtoken.sign({ name: data.email }, "secret", {
            expiresIn: process.env.REFRESHTOKENSPAN,
          });
          res.json(
            formatResponse({
              code,
              message,
              data: { ...data.toObject(), token, refreshToken },
            })
          );
        } else notFound();
      } else notFound();
    })
    .catch((err) => {
      const { code } = responseCodes.NORECORDSFOUND;
      res.json(formatResponse({ code, message: err }));
    });
};

export const updateUserDetails = (req: Request, res: Response) => {
  validateRequestParams(req, res);

  const { fullName, email, mobileNo, id } = req.body;
  userDetailsModel
    .findOneAndUpdate(
      { id },
      { $set: { fullName, email, mobileNo } },
      { new: true }
    )
    .then((result: any) => {
      const { code, message } = responseCodes.UPDATED;
      res.json(formatResponse({ code, message, data: result }));
    })
    .catch(() => {
      const { message, code } = responseCodes.NORECORDSFOUND;
      res.json(formatResponse({ code, message: `User ${message}` }));
    });
};

export const deleteUser = (req: Request, res: Response) => {
  validateRequestParams(req, res);
  const { user_id, email } = req.body;
  userDetailsModel.findOneAndDelete({ user_id, email }).then((result) => {
    if (result) {
      const { code, message } = responseCodes.DELETED;
      res.json(formatResponse({ code, message, data: result }));
    } else {
      const { code, message } = responseCodes.NORECORDSFOUND;
      res.json(formatResponse({ code, message }));
    }
  });
};
