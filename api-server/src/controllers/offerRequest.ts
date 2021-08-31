import { Agenda } from "agenda";
import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";


const mongoConnectionString = "mongodb://127.0.0.1/agenda";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

export const createOfferRequest = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {
        const payload = req.body;
        payload["dataConsumer"] = req.user.email;
        const username = req.user.email;
        const orgname = req.user.type;
        const org=req.user.orgname;
        const response = await invokeTransaction(CHANNEL, CHAINCODE, "CreateOfferRequest", JSON.stringify(payload), username, org);
        res.send(response);
    } catch (error) {
        next(error);
    }
};

export const getAllOfferRequest = async (req: ReqUser, res: Response, next: NextFunction) => {
    try {
        const username = req.user.email;
        const orgname = req.user.type;
        const org=req.user.orgname;
        const response = await queryLedger(CHANNEL, CHAINCODE, "GetAllOfferRequest", "", username, org);

        const filterkey = username == "Provider" ? "dataProvider" : "dataConsumer";
        const r = response.filter((item: any) => item[filterkey] == username);
        res.send(r);
    } catch (error) {
        next(error);
    }
};


export const acceptRejectOfferRequest = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {


        const orgname = req.user.type;
        const org=req.user.orgname;
        const offerID = req.body.offerID;
        const offerRequestID = req.body.offerRequestID;
        const isAccepted = req.body.isAccepted;

        const username = req.user.email;
        const payload = [
            offerID,
            offerRequestID,
            isAccepted
        ];
        const response = await invokeTransaction(CHANNEL, CHAINCODE, "AcceptOfferRequest", payload, username, org);


        const offerRequest = await queryLedger(CHANNEL, CHAINCODE, "GetOfferRequestByID", offerRequestID, username, org);
        if (isAccepted) {
            offerRequest["username"] = username;
            offerRequest["orgname"] = org;
            await ClearAgreement(offerRequest);
        }



        res.send(response);


    } catch (error) {
        next(error);
    }
};

async function ClearAgreement(offerRequest: any) {

    await agenda.start();

    console.log(offerRequest);
    await agenda.schedule(offerRequest.endDate, "close agreement", offerRequest);


    agenda.define(
        "close agreement",
        { concurrency: 10 },
        async (job: any) => {
            const data = job.attrs.data;
            console.log("data ====>", data);
            // TODO invoke the chaincode for cost calculation
            const response = await invokeTransaction(CHANNEL, CHAINCODE, "ReleaseEscrow", data.escrow_id, data.username, data.orgname);


        }
    );

}