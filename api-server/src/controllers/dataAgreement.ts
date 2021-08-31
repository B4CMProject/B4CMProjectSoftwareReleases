import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";
export const GetAllAgreements = async (req: ReqUser, res: Response, next: NextFunction) => {


    try {


        console.log("GetAllAgreements");
        const orgname = req.user.type;
        const username = req.user.email;
        const org=req.user.orgname;
        let dataProvider = "", dataConsumer = "", operator = "";
        if (orgname == "Provider") {
            dataProvider = username;
        } else {
            dataConsumer = username;
        }

        if (dataConsumer && dataProvider) {
            operator = "$and";
        }
        else {
            operator = "$or";
        }
        // dataProvider, dataConsumer, operator string
        const payload = [
            dataProvider, dataConsumer, operator
        ];
        console.log(payload);
        const response = await queryLedger(CHANNEL, CHAINCODE, "GetAllAgreements", payload, username, org);
        console.log(response);
        res.send(response);

    } catch (error) {
        next(error);
    }
};

export const RevokeAgreement = async (req: ReqUser, res: Response, next: NextFunction) => {


    try {

        const username = req.user.email;
        const org=req.user.orgname;
        const agreement_id = req.body.agreement_id;
        if (agreement_id) {
            const response = await invokeTransaction(CHANNEL, CHAINCODE, "RevokeAgreement", agreement_id, username, org);
            console.log(response);
            res.send(response);
        }
        else {
            throw new Error("Invalid agreement ID");

        }
    } catch (error) {
        next(error);

    }
};