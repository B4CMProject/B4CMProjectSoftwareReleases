import { Router } from "express";
import { acceptRejectOfferRequest, createOfferRequest, getAllOfferRequest } from "../controllers/offerRequest";

const router = Router();


router.post("/", createOfferRequest);
router.get("/", getAllOfferRequest);
router.post("/acceptReject", acceptRejectOfferRequest);
export default router;