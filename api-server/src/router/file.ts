import { Router } from "express";
import multer from "multer";
import { saveFile } from "../controllers/dataFile";

const router = Router();

export default function (upload: multer.Multer): Router {
    // 
    router.post("/", upload.single("file"), saveFile);
    return router;
}


