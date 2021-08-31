import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import logger from "../util/logger";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";

export const saveDataHash = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {

        const username = req.user.email;
        const orgname = req.user.type;
        const org=req.user.orgname;
        const offerId = req.body.offer_id;
        const hashID = req.body.hash_id;
        const dataHash = req.body.datahash;
        const filename = req.body.filename;
        const entrydate = req.body.entrydate;
        const payload = [
            offerId,
            hashID,
            dataHash, filename, entrydate
        ];

        const response = await invokeTransaction(CHANNEL, CHAINCODE, "InsertDataHash", payload, username, org);
        res.send(response);
    } catch (error) {
        next(error);
    }

};

export const GetDataHashByOffer = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {

        const username = req.user.email;
        const orgname = req.user.type;
        const org=req.user.orgname;
        const offerId = req.body.offer_id;

        const payload = [
            offerId,
            username
        ];
        const response = await queryLedger(CHANNEL, CHAINCODE, "GetDataHashByOfferID", payload, username, org);
        res.send(response);

    } catch (error) {
        next(error);
    }

};

export const GetDataHashByAgreement = async (req: ReqUser, res: Response, next: NextFunction) => {

    try {

        const username = req.user.email;
        const orgname = req.user.type;
        const org=req.user.orgname;
        const agreementID = req.body.agreement_id;

        const x = await queryLedger(CHANNEL, CHAINCODE, "GetDataHashByAgreementID", agreementID, username, org);
        logger.info("response");
        if (!x) {
            res.send([]);
        }
        else {
            const offer_data_hash_ids = x.agreement.offer_data_hash_id;
            const datahash = x.hashes.map((item: any) => item.data_hashes).flat();
            const p = datahash.filter((item: any) => offer_data_hash_ids.indexOf(item.id) !== -1);
            const k = p.map((item: any) => {
                return {
                    ...item,
                    offer_id: x.agreement.offer_id,
                };
            });
            res.send(k);
        }

    } catch (error) {
        next(error);
    }

};