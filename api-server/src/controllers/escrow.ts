import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";

export const GetAllEscrow = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {
        const orgname = req.user.type;
        const org=req.user.orgname;
        const username = req.user.email;
        const response = await queryLedger(CHANNEL, CHAINCODE, "GetAllEscrow", "", username, org);
        const filterkey = orgname == "Provider" ? "provider" : "consumer";
        const r = response.filter((item: any) => item[filterkey] === username);
        res.send(r);
    } catch (error) {
        next(error);
    }
};