import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    type: string;
    orgname:string;
    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: mongoose.Error, isMatch: boolean) => void) => void;


const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        orgname: { type: String, required: true },
        type: {
            type: String,
            enum: ["Consumer", "Provider"],
            default: "Consumer",
            required: true

        }

    },
    { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;




export const User = mongoose.model<UserDocument>("User", userSchema);
