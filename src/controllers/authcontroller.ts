import { Request, Response } from "express";
import * as userService from '../service/userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Changed name from 'register' to 'registerUser'
export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }
    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }
        const user = await userService.createUser(email, password);
        return res
            .status(201)
            .json({ message: "user registered successfully", userId: user.id });
    } catch (error) {
        return res.status(500).json({ message: "Error registering the user" });
    }
};

// Changed name from 'login' to 'loginUser'
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        } 

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = { userId: user.id, email: user.email };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "1h"
        });

        return res.status(200).json({ message: "Login successful", token });

    } catch (error) { 
        return res.status(500).json({ message: "Error logging in" });
    }
};
