import { Request, Response, NextFunction } from "express"; // 1. Fixed lowercase 'request' import
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../service/userService";
import { User } from "../types/user.types";

interface jwtPayload{
    // userId: number;
    email: string;
}

// 2. Extends Express's Request type globally to dynamically accept the '.user' property


export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            console.log(req.headers);
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
}
            // 1. Keep the type guard function
            function isCustomPayload(payload: any): payload is jwtPayload {
                return payload && typeof payload === 'object' && 'email' in payload;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            console.log(decoded, 'decoded token');

            // 2. Execute the type guard to safely narrow the type
            if (!isCustomPayload(decoded)) {
                return res.status(401).json({ message: "Not authorized, invalid token payload" });
            }

            // TypeScript now guarantees that 'decoded.email' exists
            const user: User | null = await findUserByEmail(decoded.email);
            
            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = user;
            return next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    
    return res.status(401).json({ message: "Not authorized, no token" });
};
