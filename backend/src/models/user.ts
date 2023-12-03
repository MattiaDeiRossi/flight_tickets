import { Schema, Model, model } from 'mongoose';
import * as crypto from 'crypto';

export interface User {
    username: string,
    role: string,
    salt: string,    // salt is a random string that will be mixed with the actual password before hashing
    digest: string,  // this is the hashed password (digest of the password)
}

export interface UserMethods {
    setPassword: (pwd: string) => void,
    validatePassword: (pwd: string) => boolean,

    checkRole: (role: string) => boolean,
    setRole: (role: string) => void,

    isAdmin: () => boolean,
    setAdmin: () => void
}
type UserModel = Model<User, {}, UserMethods>;

export enum ROLES {
    ADMIN = "boss",
    EMPLOYEE = "employee",
    EMPLOYEE_MANGER = "employee_manager",
    QUALITY_MANAGER = "quality_manager"
}

const userSchema = new Schema<User, UserModel, UserMethods>({
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: ROLES, required: true },
    salt: { type: String, required: false },
    digest: { type: String, required: false }
});

userSchema.methods.setPassword = function (pwd: string) {

    this.salt = crypto.randomBytes(16).toString('hex');
    const hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    this.digest = hmac.digest('hex');
}

userSchema.methods.validatePassword = function (pwd: string): boolean {
    const hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    const digest = hmac.digest('hex');
    return (this.digest === digest);
}

userSchema.methods.checkRole = function (role: string) {
    return this.role === role;
}

userSchema.methods.setRole = function (role: string) {
    this.role = role;
}

userSchema.methods.isAdmin = function () {
    return this.checkRole(ROLES.ADMIN);
}

userSchema.methods.setAdmin = function () {
    this.setRole(ROLES.ADMIN);
}

// Create a Model.
export const user = model<User, UserModel>('User', userSchema);