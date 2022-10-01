import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { IAuthRequest } from "../interfaces/requests";
import { IJwtRO } from "../interfaces/jwt";
dotenv.config();

export function verifyToken(
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["token"] as string;

    if (!token) {
      return res.status(401).json({
        message: "You are not allowed to access this route",
      });
    }

    const data = jwt.verify(token, process.env.SECRET as string) as IJwtRO;
    req.info = data;
  } catch (error) {
    return res.status(401).json({ error });
  }

  next();
}
