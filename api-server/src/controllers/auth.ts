import { NextFunction, Request, Response } from "express";
import { body, check, sanitize, validationResult } from "express-validator";
import _ from "lodash";
import { ReqUser } from "request-types";
import { getToken } from "../config/token";
import HttpException from "../exceptions/httperror";
import { User } from "../models/User";
import helper from "../util/helper";
import { ErrorMSG } from "../util/secrets";
/**
 * Sign in using email and password.
 * @route POST /login
 * 
 */
export const login = async (req: ReqUser, res: Response, next: NextFunction): Promise<void> => {

    try {
        console.log(req.body);

        await check("email", "Username is not valid").exists().run(req);
        await check("orgname", "Username is not valid").exists().run(req);
        await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
        const email = req.body.email;
        const orgname = req.body.orgname;
        const password = req.body.password;
        const user = await User.findOne({ email: email, orgname: orgname });
        console.log("email:", email);
        console.log("orgname:", orgname);
        console.log(user);
        if (!user) {
            throw new HttpException(500, ErrorMSG.INVALID_USER);
        }

        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) {
                console.log(err);
                throw new HttpException(500, err.message);
            }
            if (isMatch) {
                const _user = _.omit(user.toObject(), ["password"]);
                const token = getToken(_user);
                res.send({ user: _user, token });
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Log out.
 * @route GET /logout
 */
export const logout = (req: Request, res: Response): void => {
    req.logout();
    res.end();
};



/**
 * Create a new local account.
 * @route POST /signup
 */
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        await body("email", "Username is not valid").exists().run(req);
        await body("orgname", "Username is not valid").exists().run(req);
        await body("password", "Password must be at least 4 characters long").isLength({ min: 4 }).run(req);
        await body("confirmPassword", "Passwords do not match").equals(req.body.password).run(req);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new HttpException(500, errors.toString());
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            orgname: req.body.orgname
        });
        const result = await User.findOne({ email: req.body.email, orgname: req.body.orgname });

        if (result) {
            throw new HttpException(500, "Account with that username already exists.");
        }
        const response = await helper.registerAndGerSecret(user.email, user.orgname);
        await user.save();
        res.send(response);
    } catch (error) {
        next(error);
    }

};





