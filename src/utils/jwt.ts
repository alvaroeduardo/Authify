import * as jwt from "jsonwebtoken";
import { ResetPasswordToken } from "../types/types";

export const verifyJWT = (token: string): ResetPasswordToken | null => {
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY!);
        
        return decoded as ResetPasswordToken;
    } catch (error) {
        return null;
    }
}