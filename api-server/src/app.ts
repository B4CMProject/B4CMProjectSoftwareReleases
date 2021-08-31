import bluebird from "bluebird";
import compression from "compression"; // compresses requests
import cors from "cors";
import crypto from "crypto";
import express from "express";
import bearerToken from "express-bearer-token";
import expressJWT from "express-jwt";
import lusca from "lusca";
import mongoose from "mongoose";
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import path from "path";
import HttpException from "./exceptions/httperror";
import ErrorHandler from "./middleware/error";
import router from "./router/index";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const app = express();
// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

let gfs;
mongoose.connect(mongoUrl, { useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected");
        gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads"
        });
        app.set("gfs", gfs);
    });






const storage = new GridFsStorage({
    url: mongoUrl,
    file: (req: Express.Request, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err: Error, buf: Buffer) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload: multer.Multer = multer({ storage });


// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set secret variable
app.set("secret", SESSION_SECRET);
app.use(expressJWT({
    secret: SESSION_SECRET,
    algorithms: ["HS256"]
}).unless({
    path: ["/api/v1/auth/signup", "/api/v1/auth/login", "/api/v1/files", /\/api\/uploads*/]
}));
app.use(bearerToken());


app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use("/api/v1", router(upload));
app.use((req, res, next) => {
    const err = new HttpException(404, "Not Found");
    next(err);
});

app.use(ErrorHandler.errorFormatter);



export default app;


