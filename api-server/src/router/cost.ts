import { Router } from "express";
import { GetCost, GetTotalCost } from "../controllers/cost";


const router = Router();


router.get("/", GetCost);
router.get("/totalCost", GetTotalCost);

export default router;