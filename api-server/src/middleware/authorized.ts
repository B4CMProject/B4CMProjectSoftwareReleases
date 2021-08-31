import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";

export const accessGrant = (roles: string[]) => {

    return (req: ReqUser, response: Response, next: NextFunction) => {


        if (roles.includes(req.user.type)) {
            next();
        }
        throw new Error("No Authorized for this action");
    };


};

