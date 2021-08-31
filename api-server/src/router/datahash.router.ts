import { Router } from "express";
import { GetDataHashByAgreement, GetDataHashByOffer, saveDataHash } from "../controllers/datahash";

const router = Router();


router.post("/", saveDataHash);

router.post("/GetDataHashByOffer", GetDataHashByOffer);
router.post("/GetDataHashByAgreementID", GetDataHashByAgreement);

export default router;