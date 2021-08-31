import { Router } from "express";
import { GetAllEscrow } from "../controllers/escrow";

const router = Router();


router.get("/", GetAllEscrow);

export default router;