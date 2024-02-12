import * as jwt from "jsonwebtoken";
import { ResetPasswordToken, UserPayload } from "../types/types";

export const verifyJWTResetPassword = (token: string): ResetPasswordToken | null => {
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY!);
        
        return decoded as ResetPasswordToken;
    } catch (error) {
        return null;
    }
}

export const verifyJWT= (token: string): UserPayload | null => {
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY!);
        
        return decoded as UserPayload;
    } catch (error) {
        return null;
    }
}