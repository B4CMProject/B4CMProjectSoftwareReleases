import { Router } from "express";
import { GetAllAgreements, RevokeAgreement } from "../controllers/dataAgreement";

const router = Router();


router.get("/", GetAllAgreements);
router.post("/revokeAgreement", RevokeAgreement);

export default router;