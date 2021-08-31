
import { Router } from "express";
import { createOffer, getAllOffers, updateOffer } from "../controllers/offer";

const router = Router();


router.post("/", createOffer);
router.get("/", getAllOffers);
router.put("/", updateOffer);
export default router;