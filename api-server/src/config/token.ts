import { sign } from "jsonwebtoken";
import { SESSION_SECRET } from "../util/secrets";

export const getToken = (payload: any): string => {
    const token = sign({ ...payload }, SESSION_SECRET, {
        expiresIn: "24h",
        algorithm:"HS256"
    });
    return token;

};