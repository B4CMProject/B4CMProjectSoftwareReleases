import express from "express";
import { authenticate } from "passport";
import * as auth from "../controllers/auth";
const router = express.Router();

router.post("/signup", auth.signup);
router.post("/login",  auth.login);
router.post("/logout", auth.logout);

export default router;