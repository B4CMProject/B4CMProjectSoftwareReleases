import { NextFunction, Request, Response } from "express";



export const saveFile = (req: Request, res: Response, next: NextFunction) => {

    try {

        const file = req.file;
        console.log("file :", file);
        res.send(file);
    } catch (error) {
        next(error);
    }
};