import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import logger from "../util/logger";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";

export const createOffer = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {


        const payload = req.body;
        const username = req.user.email;
        const org=req.user.orgname;
        const orgname = req.user.type;
        console.log(req.user);
        payload["creator"] = username;
        const response = await invokeTransaction(CHANNEL, CHAINCODE, "InsertDataOffer", JSON.stringify(payload), username, org);
        logger.info(response);
        res.send(response);

    } catch (error) {
        next(error);
    }
};


export const getAllOffers = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {
        const email = req.user.type == "Provider" ? req.user.email : "";
        const username = req.user.email;
        const orgname = req.user.type;
        const org=req.user.orgname;
        const response = await queryLedger(CHANNEL, CHAINCODE, "GetAllOffers", email, username, org);
        logger.info(response);
        if (orgname == "Provider" && response) {
            const x = response.filter((item: any) => item.Record.dataOwner == username);
            res.send(x);
        } else {
            res.send(response);
        }

    } catch (error) {
        next(error);
    }

};

export const updateOffer = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {


        const payload = req.body;
        const username = req.user.email;
        const orgname = req.user.type;
        const org=req.user.orgname;
        console.log(req.user);
        const response = await invokeTransaction(CHANNEL, CHAINCODE, "UpdateDataOffer", JSON.stringify(payload), username, org);
        logger.info(response);
        res.send(response);

    } catch (error) {
        next(error);
    }
};
