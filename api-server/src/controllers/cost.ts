import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";

export const GetCost = async (req: ReqUser, res: Response, next: NextFunction) => {
    try {


        console.log("GetCost");
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
        const response = await queryLedger(CHANNEL, CHAINCODE, "GetCostFromEscrow", payload, username, org);
        console.log(response);
        res.send(response);

    } catch (error) {
        next(error);
    }
};


export const GetTotalCost = async (req: ReqUser, res: Response, next: NextFunction) => {
    try {


        console.log("GetTotalCost");
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
        const response = await queryLedger(CHANNEL, CHAINCODE, "GetTotalCost", payload, username, org);
        console.log(response);
        res.send(response);

    } catch (error) {
        next(error);
    }
};