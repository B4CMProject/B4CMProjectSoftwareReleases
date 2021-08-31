import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/httperror";

class ErrorHandler {
    public static errorFormatter(error: HttpException, request: Request, response: Response, next: NextFunction) {
        response.status(error.status || 500);
        response.json({
            errors: {
                message: error.message,
                path: request.path,
            },
        });
    }

}
export default ErrorHandler;
