import console from "console";
import { Application } from "express";
import _ from "lodash";
import passport from "passport";
import PassPortJWT from "passport-jwt";
import passportLocal from "passport-local";
import { Payload } from "request-types";
import { User } from "../models/User";
import logger from "../util/logger";
import { ErrorMSG, SESSION_SECRET } from "../util/secrets";

export function setupPassport(app: Application) {

    const LocalStrategy = passportLocal.Strategy;

    passport.serializeUser((user: Payload, done) => {
        console.log("serializeUser", user);
        return done(null, user._id);


    });

    passport.deserializeUser(async (id: string, done) => {

        try {
            console.log(id);
            const user = await (await User.findById(id)).toObject();
            const _user = _.omit(user, ["password"]);
            console.log("DeserializeUser", _user);
            return done(null, _user);
        } catch (error) {
            logger.error(error);
            return done(error);
        }

    });


    /**
     * Sign in using Email and Password.
     */
    passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {

        try {
            const user = await User.findOne({ email: email });
            console.log("email:", email);
            console.log(user);
            if (!user) {
                return done({ message: ErrorMSG.INVALID_USER });
            }

            user.comparePassword(password, (err: Error, isMatch: boolean) => {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (isMatch) {
                    const _user = _.omit(user.toObject(), ["password"]);
                    console.log("local", _user);
                    return done(null, _user);
                }
                return done({ message: ErrorMSG.INVALID_USER });
            });

        } catch (error) {
            logger.error(error);
            return done(error, { message: ErrorMSG.INVALID_USER });
        }
    }));



    passport.use(new PassPortJWT.Strategy({
        jwtFromRequest: PassPortJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SESSION_SECRET
    }, (payload: Payload, done) => {
        console.log(payload);
        try {

            return done(null, payload);
        } catch (error) {
            logger.error(error);
            return done(error);
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

}