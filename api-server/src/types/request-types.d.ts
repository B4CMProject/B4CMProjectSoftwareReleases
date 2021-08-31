import { Request } from "express";
import { UserDocument } from "../models/User";
export interface ReqUser extends Request {

    user?: UserDocument | Payload;
}

export interface Payload extends UserDocument {

    iat?: number,
    exp?: number
}