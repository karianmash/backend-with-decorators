import { Request } from "express";
import { IJwtRO } from "./jwt";

export interface IAuthRequest extends Request {
  info?: IJwtRO;
}
